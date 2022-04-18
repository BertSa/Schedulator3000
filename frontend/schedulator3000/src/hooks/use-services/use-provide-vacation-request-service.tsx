import { useSnackbar } from 'notistack';
import { VacationRequest, VacationRequestSubmit, VacationRequestUpdate, VacationRequestUpdateStatus } from '../../models/VacationRequest';
import { http } from './use-services';

export type IVacationRequestService = {
    create: (body: VacationRequestSubmit) => Promise<VacationRequest>,
    updateStatus: (id: number, status: VacationRequestUpdateStatus) => Promise<VacationRequest>,
    getAllByEmployeeEmail: (email: string) => Promise<VacationRequest[]>,
    getAllByManagerEmail: (email: string) => Promise<VacationRequest[]>,
    update: (body: VacationRequestUpdate) => Promise<VacationRequest>,
}

export function useProvideVacationRequestService(): IVacationRequestService {
    const {enqueueSnackbar} = useSnackbar();

    async function create(data: VacationRequestSubmit): Promise<VacationRequest> {
        const {response, body} = await http.post('/vacation-requests', data);

        if (response.ok) {
            enqueueSnackbar('Vacation sent!', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<VacationRequest>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    async function update(data: VacationRequestUpdate): Promise<VacationRequest> {
        const {response, body} = await http.put('/vacation-requests', data);

        if (response.ok) {
            enqueueSnackbar('Vacation Request updated!', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<VacationRequest>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    async function updateStatus(id: number, status: VacationRequestUpdateStatus): Promise<VacationRequest> {
        const {response, body} = await http.put(`/vacation-requests/${ id }/${ status }`);

        if (response.ok) {
            enqueueSnackbar('Vacation updated!', {
                variant: 'success',
                autoHideDuration: 3000
            });
            return Promise.resolve<VacationRequest>(body);
        }
        enqueueSnackbar(body.message, {
            variant: 'error',
            autoHideDuration: 3000
        });
        return Promise.reject(body.message);
    }

    async function getAllByEmail(endpoint: string, email: string): Promise<VacationRequest[]> {
        const {response, body} = await http.get(`/vacation-requests/${ endpoint }/${ email }`);
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
    };
}
