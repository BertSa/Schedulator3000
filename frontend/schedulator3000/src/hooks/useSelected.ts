import { useCallback } from 'react';
import useNullableState from './useNullableState';
import { Nullable } from '../models/Nullable';
import { NoParamFunction } from '../models/NoParamFunction';
import setNull from '../utilities/setNull';

export interface ISelected<T, TKey extends keyof T> {
  selected: Nullable<T[TKey]>,
  select: (obj: T) => void,
  selectByKey: (key: T[TKey]) => void,
  clear: VoidFunction,
  value: NoParamFunction<Nullable<T>>,
}

export default function useSelected
  <T, TKey extends keyof T>(elements: T[], uniqueKey: TKey, defaultSelected?: T[TKey])
  : ISelected<T, TKey> {
  const [selected, setSelected] = useNullableState<T[TKey]>(defaultSelected);

  const selectByKey = useCallback((key: T[TKey]) => {
    const element = elements.find((value) => value[uniqueKey] === key);
    const identifier:Nullable<T[TKey]> = (element ? element[uniqueKey] : null) as Nullable<T[TKey]>;
    setSelected((current) => (current === identifier ? null : identifier));
  }, [elements]);

  const select = useCallback((obj: T) => {
    const element = elements.find((value) => value[uniqueKey] === obj[uniqueKey]);
    const identifier:Nullable<T[TKey]> = (element ? element[uniqueKey] : null) as Nullable<T[TKey]>;
    setSelected((current) => (current === identifier ? null : identifier));
  }, [elements]);

  const clear = useCallback(setNull(setSelected), []);

  const value = useCallback(() => elements.find((element) => (element[uniqueKey] ?? null) === selected) ?? null, [selected, elements]);

  return {
    selected,
    select,
    selectByKey,
    clear,
    value,
  };
}
