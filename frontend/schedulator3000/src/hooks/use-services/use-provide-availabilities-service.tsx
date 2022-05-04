import { useSnackbar } from 'notistack';
import { http } from './use-services';
import { IAvailabilities } from '../../models/Availabilities';

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
      return Promise.resolve<IAvailabilities>(body);
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
      return Promise.resolve<IAvailabilities>(body);
    }
    return Promise.reject(body.message);
  }

  return {
    update,
    getByEmployeeEmail,
  };
}
