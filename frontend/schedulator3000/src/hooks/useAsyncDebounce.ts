import { useCallback, useEffect, useRef, useState } from 'react';
import useTimeout from './useTimeout';

export default function useAsyncDebounce(callback: any, delay: number = 1000, dependencies: any[] = []) {
  const [loading1, setLoading] = useState(false);
  const firstRenderRef = useRef(true);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const callbackMemoized = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    await callbackRef
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
      return;
    }
    setLoading(true);
  }, [...dependencies, reset]);
  useEffect(clear, [clear]);

  return [loading1, error, value];
}
