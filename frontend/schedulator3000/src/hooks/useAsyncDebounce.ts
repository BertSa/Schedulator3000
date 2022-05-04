import { useCallback, useEffect, useRef, useState } from 'react';
import useTimeout from './useTimeout';

export default function useAsyncDebounce(callback: any, delay: number = 1000, dependencies: any[] = []) {
  const [loading1, setLoading] = useState(false);
  const firstRenderRef = useRef(true);
  const [error, setError] = useState<any>(undefined);
  const [value, setValue] = useState<any>(undefined);

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callbackRef
      .current()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [callbackRef, ...dependencies]);

  const { reset, clear } = useTimeout(callbackMemoized, delay);
  useEffect(() => {
    reset();
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
    } else {
      setLoading(true);
    }

    return () => {
      setLoading(false);
      setError(undefined);
      setValue(undefined);
    };
  }, [...dependencies, reset]);
  useEffect(clear, [clear]);

  return [loading1, error, value];
}
