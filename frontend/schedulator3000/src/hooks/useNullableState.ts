import { useState } from 'react';
import { Nullable } from '../models/Nullable';
import { SetState } from '../models/SetState';

export default function useNullableState<T>(defaultValue?: T): [Nullable<T>, SetState<Nullable<T>>] {
  return useState<Nullable<T>>(defaultValue ?? null);
}
