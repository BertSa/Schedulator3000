import { UnpackNestedValue } from 'react-hook-form';
import React from 'react';
import { Shift } from '../../../../models/Shift';
import { Typography } from '@mui/material';
import ShiftForm, { ShiftFormFieldValue } from './ShiftForm';
import { IShiftService } from '../../../../hooks/use-services/use-provide-shift-service';
import { Employee, Manager } from '../../../../models/User';
import { zonedTimeToUtc } from 'date-fns-tz';

interface ScheduleUpdateShiftProps {
    shiftService: IShiftService,
    employees: Employee[],
    manager: Manager,
    selected: ShiftFormFieldValue,
    callbackUpdate: (shift: Shift) => void,
    callbackDelete: VoidFunction,
    closeDialog: VoidFunction,
}

export default function ShiftFormEdit({
                                  shiftService,
                                  employees,
                                  manager,
                                  selected,
                                  callbackUpdate,
                                  callbackDelete,
                                  closeDialog
                              }: ScheduleUpdateShiftProps) {
    function submit(data: UnpackNestedValue<ShiftFormFieldValue>, event?: any) {
        event?.preventDefault();
        const submitter = event?.nativeEvent.submitter.value;
        const {start, end, employeeId, shiftId} = data;

        if (!shiftId) {
            return;
        }

        if (submitter === 'delete') {
            shiftService.deleteShift(shiftId).then(callbackDelete);
            return;
        }

        const employee = employees.find(employee => employee.id === employeeId);
        if (!employee) {
            return;
        }

        const newShift: Shift = {
            id: shiftId,
            startTime: start,
            endTime: end,
            emailEmployee: employee.email,
            emailManager: manager.email,
        };

        shiftService.updateShift(newShift).then(shift =>
            callbackUpdate({
                ...shift,
                startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
                endTime: zonedTimeToUtc(shift.startTime, 'UTC'),
            }));
    }


    return <>
        <Typography variant="h5" component="h5">Update Shift</Typography>
        <ShiftForm selected={ selected }
                   submit={ submit }
                   onClose={ closeDialog }
                   employees={ employees } />
    </>;
}
