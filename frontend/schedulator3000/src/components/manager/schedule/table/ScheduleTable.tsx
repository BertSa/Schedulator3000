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
import useCurrentWeek from '../../../../hooks/use-currentWeek';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ScheduleTableRow } from './ScheduleTableRow';
import { Nullable } from '../../../../models/Nullable';
import { ShiftFormType } from '../shift-form/ShiftForm';
import { ShiftFormCreate } from '../shift-form/ShiftFormCreate';
import { ShiftFormEdit } from '../shift-form/ShiftFormEdit';

export type SelectedType = Nullable<{ employee: Employee, day: number, shift: Nullable<Shift> }>;

export interface ShiftFormFieldValue {
    start: Date,
    end: Date,
    employeeId: number,
    shiftId?: number,
}


export function ScheduleTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [vacations, setVacations] = useState<VacationRequest[]>([]);
    const [selected, setSelected] = useState<SelectedType>(null);
    const {managerService, shiftService, vacationRequestService} = useServices();
    const currentWeek = useCurrentWeek();
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

        vacationRequestService.getAllByManagerEmail(manager.email).then(response => setVacations(response));
    }, [managerService, vacationRequestService, manager.email, shiftService]);

    function createAction() {
        if (selected === null) {
            return;
        }

        const dayOfWeek: Date = currentWeek.getDayOfWeek(selected.day);
        const selectedValue: ShiftFormType = {
            employeeId: selected.employee.id,
            startTime: selected.shift?.startTime ?? dayOfWeek,
            endTime: selected.shift?.endTime ?? dayOfWeek
        };

        function callback(shift: Shift) {
            const newShift: Shift = {
                ...shift,
                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
            };
            closeDialog();
            setShifts((currentShifts: Shift[]) => [...currentShifts, newShift]);
            setSelected(current => current && ({...current, shift: newShift}));
        }

        openDialog(<ShiftFormCreate shiftService={ shiftService }
                                    employees={ employees }
                                    closeDialog={ closeDialog }
                                    selected={ selectedValue }
                                    manager={ manager }
                                    callback={ callback } />);

    }

    function editAction() {
        if (!selected?.shift) {
            return;
        }

        const selectedValue: ShiftFormType = {
            id: selected.shift.id,
            employeeId: selected.employee.id,
            startTime: selected.shift.startTime,
            endTime: selected.shift.endTime,
        };

        function callbackDelete() {
            closeDialog();
            setShifts(current => current.filter(shift => shift.id !== selectedValue.id));
            setSelected(null);
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
        if (!selected?.shift?.id) {
            return;
        }

        shiftService.deleteShift(selected.shift.id).then(() => {
                setShifts(curent => curent.filter(shift => shift.id !== selected?.shift?.id));
                setSelected(null);
            }
        );
    }


    return (
        <Container maxWidth="lg">
            <TableContainer component={ Paper }>
                <ScheduleTableToolbar
                    currentWeek={ currentWeek.value }
                    selected={ selected }
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
                            const requests: VacationRequest[] = vacations.filter(value => value.employeeEmail === employee.email);

                            return <ScheduleTableRow key={ employee.id }
                                                     employee={ employee }
                                                     shifts={ weekShift }
                                                     vacations={ requests }
                                                     selected={ selected }
                                                     currentWeek={ currentWeek }
                                                     setSelected={ setSelected }
                            />;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

