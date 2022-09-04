import { IAvailabilities } from '../../features/availiability/models/IAvailabilities';
import { request } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import useServiceResultHandler from './useServiceResultHandler';
import { IRequestDtoShiftsFromTo } from '../../models/IRequestDtoShiftsFromTo';
import { AvailabilityDto } from '../../features/availiability/models/AvailabilityDto';

interface IAvailabilitiesService {
  create: (body: IAvailabilities) => Promise<IAvailabilities>;
  update: (id:number, body: IAvailabilities) => Promise<IAvailabilities>;
  getByEmployeeEmail: (body:IRequestDtoShiftsFromTo) => Promise<AvailabilityDto[]>;
  getById: (id: number) => Promise<IAvailabilities>;
}

export default function useAvailabilitiesService(): IAvailabilitiesService {
  const handler = useServiceResultHandler();

  async function create(body: IAvailabilities): Promise<IAvailabilities> {
    const result = await request<IAvailabilities, ErrorType>(
      {
        method: 'POST',
        url: '/availabilities',
        expectedStatusCodes: [201],
        body,
      },
    );

    if (!result.ok) {
      console.log(result.errorData);
    }
    return handler({
      result,
      messageSuccess: 'Availabilities created!',
      messageError: true,
    });
  }

  async function update(id:number, body: IAvailabilities): Promise<IAvailabilities> {
    const result = await request<IAvailabilities, ErrorType>(
      {
        method: 'PUT',
        url: `/availabilities/${id}`,
        body,
      },
    );

    return handler({
      result,
      messageSuccess: 'Availabilities updated!',
      messageError: true,
    });
  }

  async function getByEmployeeEmail(body: IRequestDtoShiftsFromTo): Promise<AvailabilityDto[]> {
    const result = await request<AvailabilityDto[], ErrorType>(
      {
        method: 'POST',
        url: '/availabilities/employees',
        body,
      },
    );

    return handler({
      result,
      messageSuccess: false,
      messageError: false,
    });
  }

  async function getById(id: number): Promise<IAvailabilities> {
    const result = await request<IAvailabilities, ErrorType>(
      {
        method: 'GET',
        url: `/availabilities/${id}`,
      },
    );

    return handler({
      result,
      messageSuccess: false,
      messageError: false,
    });
  }

  return {
    create,
    update,
    getById,
    getByEmployeeEmail,
  };
}
