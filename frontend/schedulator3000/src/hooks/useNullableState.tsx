import React, { useState } from 'react';
import { Nullable } from '../models/Nullable';

export default function useNullableState<T>(defaultValue?: T): [Nullable<T>, React.Dispatch<React.SetStateAction<Nullable<T>>>] {
  return useState<Nullable<T>>(defaultValue ?? null);
}
