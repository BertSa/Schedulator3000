import { UnpackNestedValue } from 'react-hook-form';
import React from 'react';
import { Shift } from '../../../../models/Shift';
import { Typography } from '@mui/material';
import { ShiftForm, ShiftFormType } from './ShiftForm';
import { IShiftService } from '../../../../hooks/use-services/use-provide-shift-service';
import { Employee, Manager } from '../../../../models/User';
import { ShiftFormFieldValue } from '../table/ScheduleTable';

interface ScheduleUpdateShiftProps {
    shiftService: IShiftService,
    employees: Employee[],
    manager: Manager,
    selected: ShiftFormType,
    callbackUpdate: (shift: Shift) => void,
    callbackDelete: VoidFunction,
    closeDialog: VoidFunction,
}

export function ShiftFormEdit({
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
        let employee = employees.find(employee => employee.id === employeeId);

        const newShift: Shift = {
            id: shiftId,
            startTime: start,
            endTime: end,
            emailEmployee: employee?.email ?? '',
            emailManager: manager.email,
        };

        shiftService.updateShift(newShift).then(callbackUpdate);
    }


    return <>
        <Typography variant="h5" component="h5">Update Shift</Typography>
        <ShiftForm selected={ selected }
                   submit={ submit }
                   onClose={ closeDialog }
                   employees={ employees } />
    </>;
}
