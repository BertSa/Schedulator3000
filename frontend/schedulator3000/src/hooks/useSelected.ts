import { useCallback } from 'react';
import useNullableState from './useNullableState';
import { Nullable } from '../models/Nullable';
import { NoParamFunction } from '../models/NoParamFunction';
import setNull from '../utilities/setNull';

export interface ISelected<T, TKey extends keyof T, TTypeKey extends T[TKey]> {
  selected: Nullable<TTypeKey>,
  select: (obj: T) => void,
  selectByKey: (key: TTypeKey) => void,
  clear: VoidFunction,
  value: NoParamFunction<Nullable<T>>,
}

export default function useSelected
  <T, TKey extends keyof T, TTypeKey extends T[TKey]>(elements: T[], uniqueKey: TKey, defaultSelected?: TTypeKey)
  : ISelected<T, TKey, TTypeKey> {
  const [selected, setSelected] = useNullableState<TTypeKey>(defaultSelected);

  const selectByKey = useCallback((key: TTypeKey) => {
    const element = elements.find((value) => value[uniqueKey] === key);
    const identifier:Nullable<TTypeKey> = (element ? element[uniqueKey] : null) as Nullable<TTypeKey>;
    setSelected((current) => (current === identifier ? null : identifier));
  }, [elements]);

  const select = useCallback((obj: T) => {
    const element = elements.find((value) => value[uniqueKey] === obj[uniqueKey]);
    const identifier:Nullable<TTypeKey> = (element ? element[uniqueKey] : null) as Nullable<TTypeKey>;
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
