import { IAvailability } from '../../availiability/models/IAvailability';
import { request } from '../../../utilities/request';
import { ErrorType } from '../../../models/ErrorType';
import useServiceResultHandler from '../../../hooks/use-services/useServiceResultHandler';
import { IRequestDtoShiftsFromTo } from '../models/IRequestDtoShiftsFromTo';
import { IAvailabilityDto } from '../../availiability/models/IAvailabilityDto';

interface IAvailabilitiesService {
  create: (body: IAvailability) => Promise<IAvailability>;
  update: (id:number, body: IAvailability) => Promise<IAvailability>;
  getByEmployeeEmail: (body:IRequestDtoShiftsFromTo) => Promise<IAvailabilityDto[]>;
  getById: (id: number) => Promise<IAvailability>;
}

export default function useAvailabilitiesService(): IAvailabilitiesService {
  const handler = useServiceResultHandler();

  async function create(body: IAvailability): Promise<IAvailability> {
    const result = await request<IAvailability, ErrorType>(
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

  async function update(id:number, body: IAvailability): Promise<IAvailability> {
    const result = await request<IAvailability, ErrorType>(
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

  async function getByEmployeeEmail(body: IRequestDtoShiftsFromTo): Promise<IAvailabilityDto[]> {
    const result = await request<IAvailabilityDto[], ErrorType>(
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

  async function getById(id: number): Promise<IAvailability> {
    const result = await request<IAvailability, ErrorType>(
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
