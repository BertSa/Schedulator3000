import { Employee, EmployeeFormType } from '../../models/User';
import { request } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import useConfirmDialog from '../useConfirmDialog';
import useServiceResultHandler from './useServiceResultHandler';

interface IManagerService {
  addEmployee: (emailManager: string, employee: EmployeeFormType) => Promise<Employee>;
  getEmployees: (emailManager: string) => Promise<Employee[]>;
  fireEmployee: (idEmployee: number, emailManager: string) => Promise<Employee>;
}

export default function useManagerService(): IManagerService {
  const handler = useServiceResultHandler();
  const open = useConfirmDialog();

  async function addEmployee(emailManager: string, employee: EmployeeFormType): Promise<Employee> {
    const result = await request<Employee, ErrorType>(
      {
        method: 'POST',
        url: `/manager/${emailManager}/employees/create`,
        body: employee,
      },
    );

    return handler({
      result,
      messageSuccess: 'Employee added!',
      messageError: true,
    });
  }

  async function fireEmployee(idEmployee: number, emailManager: string): Promise<Employee> {
    const canceled = await open({
      title: 'Are you sure you want to fire this employee?',
      text: 'Wait a minute!',
    });

    if (canceled) {
      return Promise.reject();
    }

    const result = await request<Employee, ErrorType>(
      {
        method: 'PUT',
        url: `/manager/${emailManager}/employees/${idEmployee}/fire`,
      },
    );

    return handler({
      result,
      messageSuccess: 'Employee fired',
      messageError: true,
    });
  }

  async function getEmployees(emailManager: string): Promise<Employee[]> {
    const result = await request<Employee[], ErrorType>(
      {
        method: 'GET',
        url: `/manager/${emailManager}/employees`,
      },
    );

    return handler({
      result,
      messageSuccess: false,
      messageError: false,
    });
  }

  return {
    addEmployee,
    getEmployees,
    fireEmployee,
  };
}
