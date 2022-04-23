import { useCallback, useEffect, useRef, useState } from 'react';

export default function useAsync(callback: any, dependencies: any[] = []) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [value, setValue] = useState();

    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const callbackMemoized = useCallback(() => {
        setLoading(true);
        setError(undefined);
        setValue(undefined);
        callbackRef.current()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callbackRef, ...dependencies]);

    useEffect(() => {
        callbackMemoized();
    }, [callbackMemoized]);

    return {loading, error, value};
}
