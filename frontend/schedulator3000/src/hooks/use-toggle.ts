import { useState } from 'react';

export default function useToggle(defaultValue: boolean = false): [value: boolean, toggle: VoidFunction] {
  const [value, setValue] = useState(defaultValue);

  function toggleValue(val?: boolean) {
    setValue((currentValue) => (typeof val === 'boolean' ? val : !currentValue));
  }

  return [value, toggleValue];
}
