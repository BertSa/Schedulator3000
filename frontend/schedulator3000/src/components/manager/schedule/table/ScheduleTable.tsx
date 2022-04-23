import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Employee } from '../../../../models/User';
import { isBetween, toLocalDateString } from '../../../../utilities';
import { useAuth } from '../../../../hooks/use-auth';
import { useServices } from '../../../../hooks/use-services/use-services';
import { ShiftsFromToDto } from '../../../../models/ShiftsFromTo';
import { addWeeks, format, getDay } from 'date-fns';
import { Shift } from '../../../../models/Shift';
import { useDialog } from '../../../../hooks/use-dialog';
import { ScheduleTableToolbar } from './ScheduleTableToolbar';
import { VacationRequest } from '../../../../models/VacationRequest';
import useCurrentWeek, { ICurrentWeek } from '../../../../hooks/use-currentWeek';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ScheduleTableRow } from './ScheduleTableRow';
import { Nullable } from '../../../../models/Nullable';
import { ShiftFormFieldValue } from '../shift-form/ShiftForm';
import { ShiftFormCreate } from '../shift-form/ShiftFormCreate';
import { ShiftFormEdit } from '../shift-form/ShiftFormEdit';
import useAsync from '../../../../hooks/use-async';
import { ScheduleTableRowSkeleton } from './ScheduleTableRowSkeleton';
import useDebounce from '../../../../hooks/use-debounce';

export type SelectedItemType = Nullable<{ employee: Employee, day: number, shift: Nullable<Shift> }>;

interface Elements {
    employees: Employee[];
    weekShifts: Shift[];
    vacationRequests: VacationRequest[];
    selectedItem: { employee: Employee; day: number; shift: Nullable<Shift> } | null;
    currentWeek: ICurrentWeek;
    setSelectedItem: (value: (((prevState: ({ employee: Employee; day: number; shift: Nullable<Shift> } | null)) => ({ employee: Employee; day: number; shift: Nullable<Shift> } | null)) | { employee: Employee; day: number; shift: Nullable<Shift> } | null)) => void;
}

interface RowDataType {
    employee: Employee;
    shifts: Nullable<Shift>[];
    requests: VacationRequest[];
}

function GetElements({
                         employees,
                         weekShifts,
                         vacationRequests,
                         selectedItem,
                         currentWeek,
                         setSelectedItem
                     }: Elements): JSX.Element {
    const [rowData, setRowData] = useState<RowDataType[]>([]);

    useEffect(() => {
        employees.forEach(employee => {
            const requests: VacationRequest[] = vacationRequests.filter(value => value.employeeEmail === employee.email);
            const weekShift: Nullable<Shift>[] = new Array(7);

            let tempShifts: Shift[] = [];
            for (const value of weekShifts) {
                if (isBetween(value.startTime, currentWeek.value, addWeeks(currentWeek.value, 1)) && value.emailEmployee === employee.email) {
                    tempShifts.push(value);
                }
            }

            for (let i = 0; i < 7; i++) {
                const shift = tempShifts.find(shift => getDay(new Date(shift.startTime)) === i);
                weekShift[i] = shift ?? null;
            }


            setRowData(prevState => [...prevState.filter(c => c.employee.id !== employee.id), {
                employee,
                shifts: weekShift,
                requests
            }]);
        });
    }, [currentWeek.value, employees, vacationRequests, weekShifts]);

    return <>{ rowData.map((val) => {
        const {employee, shifts, requests} = val;


        return <ScheduleTableRow key={ employee.id }
                                 employee={ employee }
                                 shifts={ shifts }
                                 vacationRequests={ requests }
                                 selectedItem={ selectedItem }
                                 currentWeek={ currentWeek }
                                 setSelected={ setSelectedItem }
        />;
    }) }</>;
}

export function ScheduleTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
    const {managerService, shiftService, vacationRequestService} = useServices();
    const currentWeek: ICurrentWeek = useCurrentWeek();
    const [openDialog, closeDialog] = useDialog();
    const manager = useAuth().getManager();

    useDebounce(() => {
        let body: ShiftsFromToDto = {
            userEmail: manager.email,
            from: toLocalDateString(currentWeek.getPreviousWeek()),
            to: toLocalDateString(addWeeks(currentWeek.value, 2))
        };

        shiftService.getShiftsManager(body).then(
            shifts =>
                setShifts(shifts.length === 0 ?
                    [] :
                    shifts.map(shift => ({
                        ...shift,
                        startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                        endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
                    }))));
    }, 1000, [currentWeek.value]);

    const {loading} = useAsync(() => {
        console.log('ScheduleTable.useAsync');
        return new Promise<void>(async (resolve, reject) => {
            let body: ShiftsFromToDto = {
                userEmail: manager.email,
                from: toLocalDateString(currentWeek.getPreviousWeek()),
                to: toLocalDateString(addWeeks(currentWeek.value, 2))
            };
            console.log('fetchEmployees');
            await managerService.getEmployees(manager.email).then(setEmployees, reject);
            await shiftService.getShiftsManager(body).then(
                shifts =>
                    setShifts(shifts.length === 0 ?
                        [] :
                        shifts.map(shift => ({
                            ...shift,
                            startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                            endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
                        }))), reject);
            await vacationRequestService.getAllByManagerEmail(manager.email).then(setVacationRequests, reject);
            resolve();
        });
    }, []);


    function createAction() {
        if (!selectedItem) {
            return;
        }

        const dayOfWeek: Date = currentWeek.getDayOfWeek(selectedItem.day);
        const selectedValue: ShiftFormFieldValue = {
            employeeId: selectedItem.employee.id,
            start: dayOfWeek,
            end: dayOfWeek
        };

        function callback(shift: Shift) {
            closeDialog();
            setShifts((currentShifts: Shift[]) => [...currentShifts, shift]);
            setSelectedItem(current => current && ({...current, shift: shift}));
        }

        openDialog(<ShiftFormCreate shiftService={ shiftService }
                                    employees={ employees }
                                    closeDialog={ closeDialog }
                                    selected={ selectedValue }
                                    manager={ manager }
                                    callback={ callback } />);

    }

    function editAction() {
        if (!selectedItem?.shift) {
            return;
        }

        const selectedValue: ShiftFormFieldValue = {
            shiftId: selectedItem.shift.id,
            employeeId: selectedItem.employee.id,
            start: selectedItem.shift.startTime,
            end: selectedItem.shift.endTime,
        };

        function callbackDelete() {
            closeDialog();
            setShifts(current => current.filter(shift => shift.id !== selectedValue.shiftId));
            setSelectedItem(null);
        }

        function callbackUpdate(shift: Shift) {
            closeDialog();
            setShifts((currentShifts: Shift[]) => [...currentShifts.filter(v => v.id !== shift.id), shift]);
        }


        openDialog(<ShiftFormEdit shiftService={ shiftService }
                                  employees={ employees }
                                  closeDialog={ closeDialog }
                                  selected={ selectedValue }
                                  manager={ manager }
                                  callbackDelete={ callbackDelete }
                                  callbackUpdate={ callbackUpdate } />);
    }

    function removeAction() {
        if (!selectedItem?.shift?.id) {
            return;
        }

        shiftService.deleteShift(selectedItem.shift.id).then(() => {
                setShifts(current => current.filter(shift => shift.id !== selectedItem?.shift?.id));
                setSelectedItem(null);
            }
        );
    }


    return (
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <ScheduleTableToolbar
                    currentWeek={ currentWeek.value }
                    selectedItem={ selectedItem }
                    actions={ {
                        prev: currentWeek.previous,
                        next: currentWeek.next,
                        create: createAction,
                        edit: editAction,
                        remove: removeAction,
                    } }
                />
                <Table aria-label="collapsible table" size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell width="15%">Employee</TableCell>
                            <TableCell align="center">
                                Sunday<br />
                                <small>{ format(currentWeek.getDayOfWeek(0), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="center">
                                Monday<br />
                                <small>{ format(currentWeek.getDayOfWeek(1), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="center">
                                Tuesday<br />
                                <small>{ format(currentWeek.getDayOfWeek(2), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="center">
                                Wednesday<br />
                                <small>{ format(currentWeek.getDayOfWeek(3), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="center">
                                Thursday<br />
                                <small>{ format(currentWeek.getDayOfWeek(4), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="center">
                                Friday<br />
                                <small>{ format(currentWeek.getDayOfWeek(5), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="center">
                                Saturday<br />
                                <small>{ format(currentWeek.getDayOfWeek(6), 'yyyy-MM-dd') }</small>
                            </TableCell>
                            <TableCell align="right" width="7%">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { loading ?
                            <ScheduleTableRowSkeleton /> :
                            <GetElements employees={ employees } weekShifts={ shifts }
                                         vacationRequests={ vacationRequests } selectedItem={ selectedItem }
                                         currentWeek={ currentWeek } setSelectedItem={ setSelectedItem } /> }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
