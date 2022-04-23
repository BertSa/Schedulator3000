import { UnpackNestedValue } from 'react-hook-form';
import React from 'react';
import { Shift, ShiftWithoutId } from '../../../../models/Shift';
import { Typography } from '@mui/material';
import ShiftForm, { ShiftFormFieldValue } from './ShiftForm';
import { IShiftService } from '../../../../hooks/use-services/use-provide-shift-service';
import { Employee, Manager } from '../../../../models/User';
import { zonedTimeToUtc } from 'date-fns-tz';

interface ScheduleCreateShiftProps {
    shiftService: IShiftService,
    employees: Employee[],
    manager: Manager,
    selected: ShiftFormFieldValue,
    callback: (shift: Shift) => void,
    closeDialog: VoidFunction,
}

export default function ShiftFormCreate({
                                    shiftService,
                                    employees,
                                    manager,
                                    selected,
                                    callback,
                                    closeDialog
                                }: ScheduleCreateShiftProps) {
    function submit(data: UnpackNestedValue<ShiftFormFieldValue>, event?: React.BaseSyntheticEvent) {
        event?.preventDefault();
        const {start, end, employeeId} = data;
        const employee = employees.find(employee => employee.id === employeeId);

        if (!employee) {
            return;
        }

        const newShift: ShiftWithoutId = {
            startTime: start,
            endTime: end,
            emailEmployee: employee.email,
            emailManager: manager.email,
        };

        shiftService.create(newShift).then(shift =>{
            const newShift: Shift = {
                ...shift,
                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
            };
            callback(newShift)
        });
    }


    return <>
        <Typography variant="h5" component="h5">Create Shift</Typography>
        <ShiftForm selected={ selected }
                   submit={ submit }
                   onClose={ closeDialog }
                   employees={ employees } />
    </>;
}
