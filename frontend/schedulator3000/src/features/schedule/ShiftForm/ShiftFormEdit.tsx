import { UnpackNestedValue } from 'react-hook-form';
import React from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import ShiftForm, { IShiftFormFieldValue } from './ShiftForm';
import useShiftService from '../../../hooks/use-services/useShiftService';
import { Employee, Manager } from '../../../models/User';
import { IShift } from '../models/IShift';

interface IScheduleUpdateShiftProps {
  employees: Employee[];
  manager: Manager;
  selected: IShiftFormFieldValue;
  callbackUpdate: (shift: IShift) => void;
  callbackDelete: VoidFunction;
  closeDialog: VoidFunction;
}

export default function ShiftFormEdit({
  employees,
  manager,
  selected,
  callbackUpdate,
  callbackDelete,
  closeDialog,
}: IScheduleUpdateShiftProps) {
  const shiftService = useShiftService();

  const submit = (data: UnpackNestedValue<IShiftFormFieldValue>, event?: any) => {
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

    const dto: IShift = {
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
