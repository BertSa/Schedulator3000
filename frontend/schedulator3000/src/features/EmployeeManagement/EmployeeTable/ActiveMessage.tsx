import React from 'react';
import { Nullable } from '../../../models/Nullable';

export default function ActiveMessage({ isActive }: { isActive: Nullable<boolean> }) {
  // eslint-disable-next-line no-nested-ternary
  const message = isActive === null ? 'Never logged in before' : isActive ? 'Active' : 'Fired';

  return <span>{message}</span>;
}
