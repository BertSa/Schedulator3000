/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { OneOf } from '../models/OneOf';

export function useToggle<TFirst, TSecond, TOptions extends [TFirst, TSecond]>(initialValue: OneOf<TFirst, TSecond>, options:TOptions):
[OneOf<TFirst, TSecond>, ((value?: OneOf<TFirst, TSecond>) => void)] {
  const [state, setState] = useState<OneOf<TFirst, TSecond>>(initialValue);

  const toggle = (value?: OneOf<TFirst, TSecond>) => setState(
    (current: OneOf<TFirst, TSecond>) =>
      (value !== undefined && options.includes(value)) ? value
        : current === options[0] ? options[1] : options[0],
  );
  return [state, toggle];
}

export function useToggleBool(initialValue = false) : [boolean, ((value?:boolean) => void)] {
  return useToggle<true, false, [true, false]>(initialValue, [true, false]);
}
