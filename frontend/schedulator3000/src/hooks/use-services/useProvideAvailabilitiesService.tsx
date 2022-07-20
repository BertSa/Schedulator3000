import { useSnackbar } from 'notistack';
import { http } from './useServices';
import { IAvailabilities } from '../../features/availiability/models/IAvailabilities';

export interface IAvailabilitiesService {
  update: (emailEmployee:string, body: IAvailabilities) => Promise<IAvailabilities>;
  getByEmployeeEmail: (email: string) => Promise<IAvailabilities>;
}

export function useProvideAvailabilitiesService(): IAvailabilitiesService {
  const { enqueueSnackbar } = useSnackbar();

  async function update(emailEmployee:string, data: IAvailabilities): Promise<IAvailabilities> {
    const { response, body } = await http.put(`/availabilities/${emailEmployee}`, data);

    if (response.ok) {
      enqueueSnackbar('Availabilities updated!', {
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

  async function getByEmployeeEmail(emailEmployee:string): Promise<IAvailabilities> {
    const { response, body } = await http.get(`/availabilities/${emailEmployee}`);

    if (response.ok) {
      return body;
    }
    return Promise.reject(body.message);
  }

  return {
    update,
    getByEmployeeEmail,
  };
}
