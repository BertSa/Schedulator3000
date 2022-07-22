import { useCallback, useState } from 'react';

export default function useArray<T extends {}, Key extends keyof T>(uniqueIdentifier: Key, initial:T[] = []) {
  const [value, setValue] = useState<T[]>(initial);

  return {
    value,
    setValue,
    add: useCallback((val: T) => setValue((currents) => [...currents, val]), []),
    clear: useCallback(() => setValue(() => []), []),
    removeByUniqueIdentifier: useCallback(
      (id: T[Key]) => setValue((currents) => currents.filter((val) => val && val[uniqueIdentifier] !== id)),
      [],
    ),
    removeIndex: useCallback(
      (index: number) =>
        setValue((currents) => {
          currents.splice(index, 1);
          return currents;
        }),
      [],
    ),
  };
}
