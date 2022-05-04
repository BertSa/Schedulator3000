import { useCallback, useEffect, useRef } from 'react';

export default function useTimeout(callback: any, delay: number = 1000) {
  const callbackRef = useRef<any>(callback);
  const timeoutRef = useRef<any>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    // eslint-disable-next-line no-return-await,@typescript-eslint/return-await
    timeoutRef.current = setTimeout(async () => await callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}
