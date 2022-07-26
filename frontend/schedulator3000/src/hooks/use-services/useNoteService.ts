import { INote } from '../../features/EmployeeManagement/models/INote';
import { request } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import useServiceResultHandler from './useServiceResultHandler';

interface INoteService {
  update: (emailEmployee:string, body: INote) => Promise<INote>;
  getByEmployeeEmail: (email: string) => Promise<INote>;
}

export default function useNoteService(): INoteService {
  const handler = useServiceResultHandler();

  async function update(emailEmployee:string, data: INote): Promise<INote> {
    const result = await request<INote, ErrorType>(
      {
        method: 'PUT',
        url: `/notes/${emailEmployee}`,
        body: data,
      },
    );

    return handler({
      result,
      messageSuccess: 'Note updated!',
      messageError: true,
    });
  }

  async function getByEmployeeEmail(emailEmployee:string): Promise<INote> {
    const result = await request<INote, ErrorType>(
      {
        method: 'GET',
        url: `/notes/${emailEmployee}`,
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
