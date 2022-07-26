import { useCallback, useEffect, useState } from 'react';
import { ErrorType } from '../models/ErrorType';
import { NoParamFunction } from '../models/NoParamFunction';

interface IUseAsyncState<T = any> {
  loading:boolean,
  value?: T,
  error?: ErrorType
}
export default function useAsync<T = any>(fn: NoParamFunction<Promise<T>>, args: any[]): IUseAsyncState<T> {
  const [state, set] = useState<IUseAsyncState<T>>({
    loading: true,
  });
  const memoized = useCallback(fn, args);

  useEffect(() => {
    let mounted = true;
    const promise = memoized();

    promise.then(
      (value?: any) => {
        if (mounted) {
          set({
            loading: false,
            value,
          });
        }
      },
      (error?: ErrorType) => {
        if (mounted) {
          set({
            loading: false,
            error,
          });
        }
      },
    );

    return () => {
      mounted = false;
    };
  }, [memoized]);

  return state;
}
