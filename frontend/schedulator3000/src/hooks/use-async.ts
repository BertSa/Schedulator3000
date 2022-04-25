import { useCallback, useEffect, useRef, useState } from 'react';

export default function useAsync(callback: any, dependencies: any[] = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);
  const [value, setValue] = useState<any>(undefined);

  const callbackRef = useRef<any>(callback);

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
      .finally(() => {
        setLoading(false);
      });
  }, [callbackRef, ...dependencies]);

  useEffect(() => {
    if (typeof callbackMemoized === 'function') {
      callbackMemoized();
    }
  }, [callbackMemoized]);

  return { loading, error, value };
}
