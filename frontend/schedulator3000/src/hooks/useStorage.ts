import { useCallback, useState, useEffect } from 'react';

function useStorage<T>(key:string, defaultValue:T, storageObject:Storage) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }

    if (typeof defaultValue === 'function') {
      return defaultValue();
    }
    return defaultValue;
  });

  useEffect(() => {
    if (value === undefined) {
      return storageObject.removeItem(key);
    }
    storageObject.setItem(key, JSON.stringify(value));

    return () => {};
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}

export function useLocalStorage<T>(key:string, defaultValue:T) {
  return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T>(key:string, defaultValue:T) {
  return useStorage(key, defaultValue, window.sessionStorage);
}
