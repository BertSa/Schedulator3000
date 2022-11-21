import { alpha, SxProps, Theme, Toolbar, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { addDays, format } from 'date-fns';
import { IShiftFormFieldValue } from '../ShiftForm/ShiftForm';
import { IShift } from '../models/IShift';
import ShiftFormEdit from '../ShiftForm/ShiftFormEdit';
import { useDialog } from '../../../hooks/useDialog';
import { UseArrayType } from '../../../hooks/useArray';
import { KeyOf } from '../../../models/KeyOf';
import { Employee } from '../../../models/User';
import { useAuth } from '../../../contexts/AuthContext';
import useShiftService from '../hooks/useShiftService';
import ShiftFormCreate from '../ShiftForm/ShiftFormCreate';
import ScheduleTableToolbarActions from './ScheduleTableToolbarActions';
import { useCurrentWeek } from '../contexts/CurrentWeekContext';
import { useSelectedScheduleTableCell } from '../contexts/SelectedScheduleTableCellContext';

interface IScheduleTableToolbarProps {
  shifts: UseArrayType<IShift, KeyOf<IShift>>;
  employees: Employee[];
}

export default function ScheduleTableToolbar({
  shifts,
  employees,
}: IScheduleTableToolbarProps) {
  const shiftService = useShiftService();

  const currentWeek = useCurrentWeek();
  const [selectedItem, setSelectedItem] = useSelectedScheduleTableCell();
  const [openDialog, closeDialog] = useDialog();
  const manager = useAuth().getManager();

  const actionsDisabled = useMemo(() => employees.length === 0, [employees]);

  const getDateOfDay = (day: number) => format(addDays(new Date(currentWeek.value), day), 'yyyy-MM-dd');
  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selectedItem && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  const actions = {
    create: () => {
      if (!selectedItem) {
        return;
      }

      const dayOfWeek: Date = currentWeek.getDayOfWeek(selectedItem.day);

      const onFinish = (shift: IShift) => {
        closeDialog();
        shifts.add(shift);
        setSelectedItem((current) => current && { ...current, shift });
      };

      openDialog(
        <ShiftFormCreate
          employees={employees}
          closeDialog={closeDialog}
          selected={{
            employeeId: selectedItem.employee.id,
            start: dayOfWeek,
            end: dayOfWeek,
          }}
          manager={manager}
          onFinish={onFinish}
        />,
      );
    },
    edit: () => {
      if (!selectedItem?.shift) {
        return;
      }

      const selectedValue: IShiftFormFieldValue = {
        shiftId: selectedItem.shift.id,
        employeeId: selectedItem.employee.id,
        start: selectedItem.shift.startTime,
        end: selectedItem.shift.endTime,
      };

      const callbackDelete = () => {
        closeDialog();
        if (selectedValue.shiftId) {
          shifts.removeByUniqueIdentifier(selectedValue.shiftId);
        }
        setSelectedItem(null);
      };

      const callbackUpdate = (shift: IShift) => {
        closeDialog();
        shifts.update(shift);
      };

      openDialog(
        <ShiftFormEdit
          employees={employees}
          closeDialog={closeDialog}
          selected={selectedValue}
          manager={manager}
          callbackDelete={callbackDelete}
          callbackUpdate={callbackUpdate}
        />,
      );
    },
    remove: () => {
      if (!selectedItem?.shift?.id) {
        return;
      }

      shiftService.deleteShift(selectedItem.shift.id).then(() => {
        if (selectedItem?.shift?.id) {
          shifts.removeByUniqueIdentifier(selectedItem.shift.id);
        }
        setSelectedItem(null);
      });
    },
    prev: currentWeek.previous,
    next: currentWeek.next,
    today: currentWeek.thisWeek,
  };

  return (
    <Toolbar sx={toolbarSx}>
      <Typography variant="h5" component="div">
        Schedule
      </Typography>
      <Typography variant="h6" component="div">
        {selectedItem ? getDateOfDay(selectedItem.day) : format(currentWeek.value, 'yyyy-MM-dd')}
      </Typography>
      <ScheduleTableToolbarActions
        actionsDisabled={actionsDisabled}
        actions={actions}
        selectedItem={selectedItem}
      />
    </Toolbar>
  );
}
