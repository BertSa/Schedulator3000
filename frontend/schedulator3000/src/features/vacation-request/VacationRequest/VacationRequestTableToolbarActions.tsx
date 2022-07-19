import { Add, CancelRounded, Delete, Edit } from '@mui/icons-material';
import React from 'react';
import VacationRequestTableToolbarAction from '../VacationRequestTableToolbarAction';
import { VacationRequestStatus } from '../../../enums/VacationRequestStatus';
import { IActions } from './VacationRequestTable';
import { IVacationRequest } from '../models/IVacationRequest';
import { Nullable } from '../../../models/Nullable';

export default function VacationRequestTableToolbarActions({
  selected,
  actions: { create, edit, cancel, delete: del },
}: { selected: Nullable<IVacationRequest>, actions: IActions }) {
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
