import { useState } from 'react';

export default function useToggle(defaultValue: boolean = false): [value: boolean, toggle: (val?: any) => void] {
  const [value, setValue] = useState(defaultValue);

  function toggleValue(val?: any) {
    setValue((currentValue) => (typeof val === 'boolean' ? val : !currentValue));
  }

  return [value, toggleValue];
}
