import { UnpackNestedValue } from 'react-hook-form';
import React from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ShiftWithoutId } from '../../../../models/ShiftWithoutId';
import ShiftForm, { ShiftFormFieldValue } from './ShiftForm';
import { IShiftService } from '../../../../hooks/use-services/useProvideShiftService';
import { Employee, Manager } from '../../../../models/User';
import { IShift } from '../../../../models/IShift';

interface ScheduleCreateShiftProps {
  shiftService: IShiftService;
  employees: Employee[];
  manager: Manager;
  selected: ShiftFormFieldValue;
  callback: (shift: IShift) => void;
  closeDialog: VoidFunction;
}

export default function ShiftFormCreate({
  shiftService,
  employees,
  manager,
  selected,
  callback,
  closeDialog,
}: ScheduleCreateShiftProps) {
  const submit = (data: UnpackNestedValue<ShiftFormFieldValue>, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    const { start, end, employeeId } = data;
    const employee = employees.find((emp) => emp.id === employeeId);

    if (!employee) {
      return;
    }

    const dto: ShiftWithoutId = {
      startTime: start,
      endTime: end,
      emailEmployee: employee.email,
      emailManager: manager.email,
    };

    shiftService.create(dto).then((shift) => {
      const newShift: IShift = {
        ...shift,
        startTime: zonedTimeToUtc(shift.startTime, 'UTC'),
        endTime: zonedTimeToUtc(shift.endTime, 'UTC'),
      };
      callback(newShift);
    });
  };

  return (
    <ShiftForm
      selected={selected}
      submit={submit}
      onClose={closeDialog}
      employees={employees}
      title="Create Shift"
    />
  );
}
