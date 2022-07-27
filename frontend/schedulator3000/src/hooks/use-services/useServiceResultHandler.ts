import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { TResponse } from '../../utilities/request';
import { ErrorType } from '../../models/ErrorType';
import { OneOf } from '../../models/OneOf';

export default function useServiceResultHandler() {
  const { enqueueSnackbar } = useSnackbar();

  const handle = <T extends any>({ result, messageSuccess, messageError }:
  { result: TResponse<T, ErrorType>, messageSuccess: OneOf<string, false>, messageError: OneOf<string, boolean> }): Promise<T> => {
    if (result.ok) {
      if (messageSuccess) {
        enqueueSnackbar(messageSuccess, {
          variant: 'success',
          autoHideDuration: 3000,
        });
      }

      return Promise.resolve(result.data);
    }
    if (messageError) {
      enqueueSnackbar(messageError ?? result.errorData.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
    return Promise.reject(messageError ?? result.errorData.message);
  };

  return useCallback(handle, []);
}
