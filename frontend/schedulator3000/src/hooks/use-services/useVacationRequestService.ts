import useServiceResultHandler from './useServiceResultHandler';
import useConfirmDialog from '../useConfirmDialog';
import { VacationRequestCreate } from '../../features/vacation-request/models/VacationRequestCreate';
import { IVacationRequest } from '../../features/vacation-request/models/IVacationRequest';
import { request } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import { VacationRequestUpdate } from '../../features/vacation-request/models/VacationRequestUpdate';
import { VacationRequestUpdateStatus } from '../../enums/VacationRequestUpdateStatus';

interface IVacationRequestService {
  create: (body: VacationRequestCreate) => Promise<IVacationRequest>;
  updateStatus: (id: number, status: VacationRequestUpdateStatus) => Promise<IVacationRequest>;
  getAllByEmployeeEmail: (email: string) => Promise<IVacationRequest[]>;
  getAllByManagerEmail: (email: string) => Promise<IVacationRequest[]>;
  update: (body: VacationRequestUpdate) => Promise<IVacationRequest>;
  deleteById: (id: number) => Promise<void>;
}

export default function useVacationRequestService(): IVacationRequestService {
  const handler = useServiceResultHandler();
  const open = useConfirmDialog();

  async function create(body: VacationRequestCreate): Promise<IVacationRequest> {
    const result = await request<IVacationRequest, ErrorType>(
      {
        method: 'POST',
        url: '/vacation-requests',
        body,
      },
    );

    return handler({
      result,
      messageSuccess: 'Vacation sent!',
      messageError: true,
    });
  }

  async function update(data: VacationRequestUpdate): Promise<IVacationRequest> {
    const result = await request<IVacationRequest, ErrorType>(
      {
        method: 'PUT',
        url: `/vacation-requests/${data.id}`,
        body: data,
      },
    );

    return handler({
      result,
      messageSuccess: 'Vacation Request updated!',
      messageError: true,
    });
  }

  async function deleteById(id: number): Promise<void> {
    const canceledByDialog = await open(
      {
        text: 'Are you sure you want to delete this vacation request?',
        title: 'Wait a minute!',
      },
    );

    if (canceledByDialog) {
      return Promise.reject();
    }

    const result = await request<IVacationRequest, ErrorType>(
      {
        method: 'DELETE',
        url: `/vacation-requests/${id}`,
      },
    );

    return handler({
      result,
      messageSuccess: 'Vacation Request deleted!',
      messageError: true,
    }).then(() => true, (reason) => reason);
  }

  async function updateStatus(id: number, status: VacationRequestUpdateStatus): Promise<IVacationRequest> {
    const result = await request<IVacationRequest, ErrorType>(
      {
        method: 'PUT',
        url: `/vacation-requests/${id}/${status}`,
      },
    );

    return handler({
      result,
      messageSuccess: 'Vacation updated!',
      messageError: true,
    });
  }

  async function getAllByEmail(endpoint: string, email: string): Promise<IVacationRequest[]> {
    const result = await request<IVacationRequest[], ErrorType>(
      {
        method: 'GET',
        url: `/vacation-requests/${endpoint}/${email}`,
      },
    );

    return handler({
      result,
      messageSuccess: false,
      messageError: false,
    });
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
