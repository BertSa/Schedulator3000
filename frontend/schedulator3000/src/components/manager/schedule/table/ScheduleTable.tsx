import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Employee } from '../../../../models/User';
import { toLocalDateString } from '../../../../utilities';
import { useAuth } from '../../../../hooks/use-auth';
import { useServices } from '../../../../hooks/use-services/use-services';
import { ShiftsFromToDto } from '../../../../models/ShiftsFromTo';
import { format, getDay } from 'date-fns';
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

export type SelectedItemType = Nullable<{ employee: Employee, day: number, shift: Nullable<Shift> }>;

export function ScheduleTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
    const {managerService, shiftService, vacationRequestService} = useServices();
    const currentWeek: ICurrentWeek = useCurrentWeek();
    const [openDialog, closeDialog] = useDialog();
    const manager = useAuth().getManager();


    useEffect(() => {
        let body: ShiftsFromToDto = {
            userEmail: manager.email,
            from: toLocalDateString(currentWeek.getPreviousWeek()),
            to: toLocalDateString(currentWeek.getNextWeek())
        };
        managerService.getEmployees(manager.email).then(
            list => {
                setEmployees(list);
                shiftService.getShiftsManager(body).then(
                    shifts =>
                        setShifts(shifts.length === 0 ?
                            [] :
                            shifts.map(shift => ({
                                ...shift,
                                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                                endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
                            }))));
            });

        vacationRequestService.getAllByManagerEmail(manager.email).then(response => setVacationRequests(response));
    }, [managerService, vacationRequestService, manager.email, shiftService]);

    function createAction() {
        if (selectedItem === null) {
            return;
        }

        const dayOfWeek: Date = currentWeek.getDayOfWeek(selectedItem.day);
        const selectedValue: ShiftFormFieldValue = {
            employeeId: selectedItem.employee.id,
            start: selectedItem.shift?.startTime ?? dayOfWeek,
            end: selectedItem.shift?.endTime ?? dayOfWeek
        };

        function callback(shift: Shift) {
            const newShift: Shift = {
                ...shift,
                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
            };
            closeDialog();
            setShifts((currentShifts: Shift[]) => [...currentShifts, newShift]);
            setSelectedItem(current => current && ({...current, shift: newShift}));
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
            setShifts((currentShifts: Shift[]) => [...currentShifts.filter(v => v.id !== shift.id),
                {
                    ...shift,
                    startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                    endTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                }]);
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
                    selected={ selectedItem }
                    actions={ {
                        prev: currentWeek.previous,
                        next: currentWeek.next,
                        create: createAction,
                        edit: editAction,
                        remove: removeAction,
                    } }
                />
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Employee</TableCell>
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
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { employees.map((employee) => {
                            const weekShift: Nullable<Shift>[] = new Array(7);
                            const filter: Shift[] = shifts.filter(value => currentWeek.isDuringWeek(value.startTime) && value.emailEmployee === employee.email);
                            for (let i = 0; i < 7; i++) {
                                const shift = filter.find(shift => getDay(new Date(shift.startTime)) === i);
                                weekShift[i] = shift ?? null;
                            }
                            const requests: VacationRequest[] = vacationRequests.filter(value => value.employeeEmail === employee.email);

                            return <ScheduleTableRow key={ employee.id }
                                                     employee={ employee }
                                                     shifts={ weekShift }
                                                     vacations={ requests }
                                                     selected={ selectedItem }
                                                     currentWeek={ currentWeek }
                                                     setSelected={ setSelectedItem }
                            />;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

