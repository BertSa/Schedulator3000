import { Add, CancelRounded, Delete, Edit } from '@mui/icons-material';
import React from 'react';
import VacationRequestTableToolbarAction from '../VacationRequestTableToolbarAction';
import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';
import { IVacationRequestTableToolbarProps } from './VacationRequestTableToolbar';

export default function VacationRequestTableToolbarActions({
  selected,
  actions: { create, edit, cancel, del },
}: IVacationRequestTableToolbarProps) {
  if (selected) {
    return (
      <div>
        <VacationRequestTableToolbarAction
          title="Delete"
          action={del}
          disabled={[VacationRequestStatus.Approved, VacationRequestStatus.Cancelled].includes(selected.status)}
          icon={Delete}
        />
        <VacationRequestTableToolbarAction
          title="Cancel request"
          action={cancel}
          disabled={selected.status !== VacationRequestStatus.Approved}
          icon={CancelRounded}
        />
        <VacationRequestTableToolbarAction
          title="Edit"
          action={edit}
          disabled={selected.status !== VacationRequestStatus.Pending}
          icon={Edit}
        />
      </div>
    );
  }

  return (
    <div>
      <VacationRequestTableToolbarAction
        title="Request"
        action={create}
        icon={Add}
      />
    </div>
  );
}
