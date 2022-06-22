import { useSnackbar } from 'notistack';
import { http } from './useServices';
import { INote } from '../../models/INote';

export interface INoteService {
  update: (emailEmployee:string, body: INote) => Promise<INote>;
  getByEmployeeEmail: (email: string) => Promise<INote>;
}

export function useProvideNoteService(): INoteService {
  const { enqueueSnackbar } = useSnackbar();

  async function update(emailEmployee:string, data: INote): Promise<INote> {
    const { response, body } = await http.put(`/notes/${emailEmployee}`, data);

    if (response.ok) {
      enqueueSnackbar('Note updated!', {
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

  async function getByEmployeeEmail(emailEmployee:string): Promise<INote> {
    const { response, body } = await http.get(`/notes/${emailEmployee}`);

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
