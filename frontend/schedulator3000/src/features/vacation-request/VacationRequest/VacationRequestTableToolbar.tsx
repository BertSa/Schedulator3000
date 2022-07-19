import { alpha, SxProps, Theme, Toolbar } from '@mui/material';
import React from 'react';
import { IVacationRequest } from '../models/IVacationRequest';
import { Nullable } from '../../../models/Nullable';
import VacationRequestTableToolbarTitle from '../VacationRequestTableToolbarTitle';
import VacationRequestTableToolbarActions from './VacationRequestTableToolbarActions';
import { IActions } from './VacationRequestTable';
import VacationRequestFormCreate from '../form/VacationRequestFormCreate';
import VacationRequestFormEdit from '../form/VacationRequestFormEdit';
import DialogWarningDelete from '../../../components/DialogWarningDelete';
import { VacationRequestUpdateStatus } from '../../../enums/VacationRequestUpdateStatus';
import { useDialog } from '../../../hooks/useDialog';
import { Employee } from '../../../models/User';
import { useAuth } from '../../../contexts/AuthContext';
import { useServices } from '../../../hooks/use-services/useServices';
import { SetState } from '../../../models/SetState';

export interface IVacationRequestTableToolbarProps {
  selectedVacationRequestId: Nullable<number>,
  vacationRequests: IVacationRequest[],
  setVacationRequests: SetState<IVacationRequest[]>,
  setSelectedVacationRequestId: SetState<Nullable<number>>
}

export default function VacationRequestTableToolbar(props: IVacationRequestTableToolbarProps) {
  const { selectedVacationRequestId, vacationRequests, setVacationRequests, setSelectedVacationRequestId } = props;
  const [openDialog, closeDialog] = useDialog();
  const { vacationRequestService } = useServices();
  const employee: Employee = useAuth().getEmployee();

  const toolbarSx: SxProps<Theme> = {
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    justifyContent: 'space-between',
    ...(selectedVacationRequestId && {
      bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
    }),
  };

  const onFinish = (vacationRequest: IVacationRequest): void => {
    closeDialog();
    setVacationRequests((current) => [...current.filter((value) => value.id !== vacationRequest.id), vacationRequest]);
  };

  const actions: IActions = {
    create: (): void => {
      openDialog(
        <VacationRequestFormCreate
          onFinish={onFinish}
          onCancel={closeDialog}
          employee={employee}
        />,
      );
    },

    edit: (): void => {
      openDialog(
        <VacationRequestFormEdit
          onFinish={onFinish}
          onCancel={closeDialog}
          vacationRequest={vacationRequests.find((value) => value.id === selectedVacationRequestId)!}
        />,
      );
    },

    cancel: async (): Promise<void> => {
      if (!selectedVacationRequestId) {
        return;
      }

      const canceledByDialog = await new Promise<boolean>((resolve) => {
        openDialog(
          <DialogWarningDelete
            text="Are you sure you want to cancel this vacation request?"
            title="Cancel vacation request"
            closeDialog={closeDialog}
            resolve={resolve}
          />,
        );
      });

      if (canceledByDialog) {
        return;
      }

      vacationRequestService.updateStatus(selectedVacationRequestId, VacationRequestUpdateStatus.Cancel).then((response) => {
        setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequestId), response]);
        setSelectedVacationRequestId(response.id);
      });
    },

    delete: async (): Promise<void> => {
      if (!selectedVacationRequestId) {
        return;
      }

      vacationRequestService.deleteById(selectedVacationRequestId).then(() => {
        setVacationRequests((current) => [...current.filter((v) => v.id !== selectedVacationRequestId)]);
        setSelectedVacationRequestId(null);
      });
    },

  };

  return (
    <Toolbar sx={toolbarSx}>
      <VacationRequestTableToolbarTitle selectedVacationRequest={selectedVacationRequestId} />
      <VacationRequestTableToolbarActions
        selected={vacationRequests.find((value) => value.id === selectedVacationRequestId) ?? null}
        actions={actions}
      />
    </Toolbar>
  );
}
