import { Employee, EmployeeFormType } from '../../models/User';
import { request } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import useServiceResultHandler from './useServiceResultHandler';

interface IEmployeeService {
  updateEmployee: (body: EmployeeFormType) => Promise<Employee>;
}

export default function useEmployeeService(): IEmployeeService {
  const handler = useServiceResultHandler();

  async function updateEmployee(body: EmployeeFormType): Promise<Employee> {
    const result = await request<Employee, ErrorType>(
      {
        method: 'PUT',
        url: '/employees',
        body,
      },
    );

    return handler({
      result,
      messageSuccess: 'Employee Updated!',
      messageError: true,
    });
  }

  return {
    updateEmployee,
  };
}
