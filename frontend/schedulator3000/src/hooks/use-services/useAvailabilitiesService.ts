import { IAvailabilities } from '../../features/availiability/models/IAvailabilities';
import { request } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import useServiceResultHandler from './useServiceResultHandler';

interface IAvailabilitiesService {
  update: (emailEmployee:string, body: IAvailabilities) => Promise<IAvailabilities>;
  getByEmployeeEmail: (email: string) => Promise<IAvailabilities>;
}

export default function useAvailabilitiesService(): IAvailabilitiesService {
  const handler = useServiceResultHandler();

  async function update(emailEmployee:string, body: IAvailabilities): Promise<IAvailabilities> {
    const result = await request<IAvailabilities, ErrorType>(
      {
        method: 'PUT',
        url: `/availabilities/${emailEmployee}`,
        body,
      },
    );

    return handler({
      result,
      messageSuccess: 'Availabilities updated!',
      messageError: true,
    });
  }

  async function getByEmployeeEmail(emailEmployee:string): Promise<IAvailabilities> {
    const result = await request<IAvailabilities, ErrorType>(
      {
        method: 'GET',
        url: `/availabilities/${emailEmployee}`,
      },
    );

    return handler({
      result,
      messageSuccess: false,
      messageError: false,
    });
  }

  return {
    update,
    getByEmployeeEmail,
  };
}
