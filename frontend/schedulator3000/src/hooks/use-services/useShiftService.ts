import { IRequestDtoShiftsFromTo } from '../../models/IRequestDtoShiftsFromTo';
import { ShiftWithoutId } from '../../features/schedule/models/ShiftWithoutId';
import { IShift } from '../../features/schedule/models/IShift';
import { request } from '../../utilities/request';
import { Employee } from '../../models/User';
import { ErrorType } from '../../models/ErrorType';
import useConfirmDialog from '../useConfirmDialog';
import useServiceResultHandler from './useServiceResultHandler';

const PATH = '/shifts';

interface IShiftService {
  getShiftsManager: (body: IRequestDtoShiftsFromTo) => Promise<IShift[]>;
  getShiftsEmployee: (body: IRequestDtoShiftsFromTo) => Promise<IShift[]>;
  create: (body: ShiftWithoutId) => Promise<IShift>;
  updateShift: (body: IShift) => Promise<IShift>;
  deleteShift: (id: number) => Promise<void>;
}

export default function useShiftService(): IShiftService {
  const handler = useServiceResultHandler();
  const open = useConfirmDialog();

  async function getShifts(userType: string, body: IRequestDtoShiftsFromTo): Promise<IShift[]> {
    const result = await request<IShift[], ErrorType>(
      {
        method: 'POST',
        url: `${PATH}/${userType}`,
        body,
      },
    );

    return handler({
      result,
      messageSuccess: false,
      messageError: true,
    });
  }

  const getShiftsManager = async (body: IRequestDtoShiftsFromTo): Promise<IShift[]> => getShifts('manager', body);
  const getShiftsEmployee = async (body: IRequestDtoShiftsFromTo): Promise<IShift[]> => getShifts('employee', body);

  async function create(body: ShiftWithoutId): Promise<IShift> {
    const result = await request<IShift, ErrorType>(
      {
        method: 'POST',
        url: `${PATH}/manager/create`,
        body,
        expectedStatusCodes: [201],
      },
    );

    return handler({
      result,
      messageSuccess: 'Shift Created!',
      messageError: true,
    });
  }

  async function updateShift(body: IShift): Promise<IShift> {
    const result = await request<IShift, ErrorType>(
      {
        method: 'PUT',
        url: `${PATH}/manager/update`,
        body,
      },
    );
    return handler({
      result,
      messageSuccess: 'Shift Updated!',
      messageError: true,
    });
  }

  async function deleteShift(id: number): Promise<void> {
    const canceled = await open(
      {
        title: 'Wait a minute!',
        text: 'Are you sure you want to delete this shift?',
      },
    );

    if (canceled) {
      return Promise.reject();
    }

    const result = await request<Employee, ErrorType>(
      {
        method: 'DELETE',
        url: `${PATH}/manager/delete/${id}`,
      },
    );

    return handler({
      result,
      messageSuccess: 'Shift Deleted!',
      messageError: true,
    }).then(() => true, (reason) => reason);
  }

  return {
    getShiftsManager,
    getShiftsEmployee,
    create,
    updateShift,
    deleteShift,
  };
}
