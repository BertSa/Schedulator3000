import { UnpackNestedValue } from 'react-hook-form';
import React from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Shift } from '../../../../models/Shift';
import ShiftForm, { ShiftFormFieldValue } from './ShiftForm';
import { IShiftService } from '../../../../hooks/use-services/useProvideShiftService';
import { Employee, Manager } from '../../../../models/User';

interface ScheduleUpdateShiftProps {
  shiftService: IShiftService;
  employees: Employee[];
  manager: Manager;
  selected: ShiftFormFieldValue;
  callbackUpdate: (shift: Shift) => void;
  callbackDelete: VoidFunction;
  closeDialog: VoidFunction;
}

export default function ShiftFormEdit({
  shiftService,
  employees,
  manager,
  selected,
  callbackUpdate,
  callbackDelete,
  closeDialog,
}: ScheduleUpdateShiftProps) {
  const submit = (data: UnpackNestedValue<ShiftFormFieldValue>, event?: any) => {
    event?.preventDefault();
    const submitter = event?.nativeEvent.submitter.value;
    const { start, end, employeeId, shiftId } = data;

    if (!shiftId) {
      return;
    }

    if (submitter === 'delete') {
      shiftService.deleteShift(shiftId).then(callbackDelete);
      return;
    }

    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) {
      return;
    }

    const dto: Shift = {
      id: shiftId,
      startTime: start,
      endTime: end,
      emailEmployee: employee.email,
      emailManager: manager.email,
    };

    shiftService.updateShift(dto).then((shift) =>
      callbackUpdate({
        ...shift,
        startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
        endTime: zonedTimeToUtc(shift.startTime, 'UTC'),
      }));
  };

  return (
    <ShiftForm
      selected={selected}
      submit={submit}
      onClose={closeDialog}
      employees={employees}
      title="Update Shift"
    />
  );
}
