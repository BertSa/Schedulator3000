import { useCallback, useState } from 'react';
import { SetState } from '../models/SetState';

export interface UseArrayType<T extends {}, Key extends keyof T> {
  value: T[],
  setValue: SetState<T[]>,
  add: (val:T) => void,
  clear: VoidFunction,
  update: (val:T) => void,
  removeByUniqueIdentifier: (val:T[Key]) => void,
  removeIndex: (val:number) => void,
  getBy:(key:Key, item: T[Key]) => T | undefined,
  getAllBy:(key:Key, item: T[Key]) => T[],
}

export default function useArray<T extends {}, Key extends keyof T>(uniqueIdentifier: Key, initial:T[] = []): UseArrayType<T, Key> {
  const [value, setValue] = useState<T[]>(initial);

  return {
    value,
    setValue,
    add: useCallback((val: T) => setValue((currents) => [...currents, val]), []),
    clear: useCallback(() => setValue(() => []), []),
    update: useCallback((val: T) => setValue((current) =>
      [...current.filter((v) => v[uniqueIdentifier] !== val[uniqueIdentifier]), val]), []),
    getBy: useCallback((key, item) => value.find((val) => val[key] === item), [value]),
    getAllBy: useCallback((key, item) => value.filter((val) => val[key] === item), [value]),
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
