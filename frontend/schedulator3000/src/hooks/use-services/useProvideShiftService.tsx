import { useSnackbar } from 'notistack';
import React from 'react';
import { useDialog } from '../useDialog';
import { IRequestDtoShiftsFromTo } from '../../models/IRequestDtoShiftsFromTo';
import { ShiftWithoutId } from '../../models/ShiftWithoutId';
import DialogWarningDelete from '../../components/DialogWarningDelete';
import { http } from './useServices';
import { IShift } from '../../models/IShift';

const PATH = '/shifts';

export interface IShiftService {
  getShiftsManager: (body: IRequestDtoShiftsFromTo) => Promise<IShift[]>;
  getShiftsEmployee: (body: IRequestDtoShiftsFromTo) => Promise<IShift[]>;
  create: (body: ShiftWithoutId) => Promise<IShift>;
  updateShift: (body: IShift) => Promise<IShift>;
  deleteShift: (id: number) => Promise<void>;
}

export function useProvideShiftService(): IShiftService {
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, closeDialog] = useDialog();

  async function getShifts(userType: string, data: IRequestDtoShiftsFromTo): Promise<IShift[]> {
    const { response, body } = await http.post(`${PATH}/${userType}`, data);

    if (response.ok) {
      return body;
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
    return Promise.reject(body.message);
  }

  const getShiftsManager = async (body: IRequestDtoShiftsFromTo): Promise<IShift[]> => getShifts('manager', body);
  const getShiftsEmployee = async (body: IRequestDtoShiftsFromTo): Promise<IShift[]> => getShifts('employee', body);

  async function create(data: ShiftWithoutId): Promise<IShift> {
    const { response, body } = await http.post(`${PATH}/manager/create`, data);

    if (response.status === 201) {
      enqueueSnackbar('Shift Created!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return body;
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
    return Promise.reject(body.message);
  }

  async function updateShift(data: IShift): Promise<IShift> {
    const { response, body } = await http.put(`${PATH}/manager/update`, data);
    if (response.ok) {
      enqueueSnackbar('Shift Updated!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      return body;
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
    return Promise.reject(body.message);
  }

  async function deleteShift(id: number): Promise<void> {
    const canceled = await new Promise<boolean>((resolve) => {
      openDialog(
        <DialogWarningDelete
          resolve={resolve}
          closeDialog={closeDialog}
          title="Wait a minute!"
          text="Are you sure you want to delete this shift?"
        />,
      );
    });

    if (canceled) {
      return Promise.reject();
    }

    const { response, body } = await http.del(`${PATH}/manager/delete/${id}`);

    if (response.ok) {
      enqueueSnackbar('Shift Deleted!', {
        variant: 'success',
        autoHideDuration: 3000,
      });

      return Promise.resolve();
    }
    enqueueSnackbar(body.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });

    return Promise.reject(body.message);
  }

  return {
    getShiftsManager,
    getShiftsEmployee,
    create,
    updateShift,
    deleteShift,
  };
}
