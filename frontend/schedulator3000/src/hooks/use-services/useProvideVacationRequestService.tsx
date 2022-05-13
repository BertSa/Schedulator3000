import { useSnackbar } from 'notistack';
import React from 'react';
import {
  VacationRequest,
  VacationRequestCreate,
  VacationRequestUpdate,
  VacationRequestUpdateStatus,
} from '../../models/VacationRequest';
import { http } from './useServices';
import { useDialog } from '../useDialog';
import DialogWarningDelete from '../../components/DialogWarningDelete';

export interface IVacationRequestService {
  create: (body: VacationRequestCreate) => Promise<VacationRequest>;
  updateStatus: (id: number, status: VacationRequestUpdateStatus) => Promise<VacationRequest>;
  getAllByEmployeeEmail: (email: string) => Promise<VacationRequest[]>;
  getAllByManagerEmail: (email: string) => Promise<VacationRequest[]>;
  update: (body: VacationRequestUpdate) => Promise<VacationRequest>;
  deleteById: (id: number) => Promise<void>;
}

export function useProvideVacationRequestService(): IVacationRequestService {
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, closeDialog] = useDialog();

  async function create(data: VacationRequestCreate): Promise<VacationRequest> {
    const { response, body } = await http.post('/vacation-requests', data);

    if (response.ok) {
      enqueueSnackbar('Vacation sent!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve<VacationRequest>(body);
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
    return Promise.reject(body.message);
  }

  async function update(data: VacationRequestUpdate): Promise<VacationRequest> {
    const { response, body } = await http.put(`/vacation-requests/${data.id}`, data);

    if (response.ok) {
      enqueueSnackbar('Vacation Request updated!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve<VacationRequest>(body);
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
    return Promise.reject(body.message);
  }

  async function deleteById(id:number): Promise<void> {
    const canceledByDialog = await new Promise<boolean>((resolve) => {
      openDialog(
        <DialogWarningDelete
          text="Are you sure you want to delete this vacation request?"
          title="Wait a minute!"
          closeDialog={closeDialog}
          resolve={resolve}
        />,
      );
    });

    if (canceledByDialog) {
      return Promise.reject();
    }

    const { response, body } = await http.del(`/vacation-requests/${id}`);

    if (!response.ok) {
      enqueueSnackbar(body.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
      return Promise.reject(body.message);
    }

    enqueueSnackbar('Vacation Request deleted!', {
      variant: 'success',
      autoHideDuration: 3000,
    });

    return Promise.resolve();
  }

  async function updateStatus(id: number, status: VacationRequestUpdateStatus): Promise<VacationRequest> {
    const { response, body } = await http.put(`/vacation-requests/${id}/${status}`);

    if (response.ok) {
      enqueueSnackbar('Vacation updated!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return Promise.resolve<VacationRequest>(body);
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
    return Promise.reject(body.message);
  }

  async function getAllByEmail(endpoint: string, email: string): Promise<VacationRequest[]> {
    const { response, body } = await http.get(`/vacation-requests/${endpoint}/${email}`);
    if (response.ok) {
      return Promise.resolve<VacationRequest[]>(body);
    }

    return Promise.reject(body.message);
  }

  const getAllByEmployeeEmail = (email: string) => getAllByEmail('employee', email);
  const getAllByManagerEmail = (email: string) => getAllByEmail('manager', email);

  return {
    create,
    updateStatus,
    getAllByEmployeeEmail,
    getAllByManagerEmail,
    update,
    deleteById,
  };
}
