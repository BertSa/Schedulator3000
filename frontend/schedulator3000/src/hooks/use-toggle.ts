import { useState } from 'react';

export default function useToggle(defaultValue: boolean = false): [boolean, () => void] {
    const [value, setValue] = useState(defaultValue);

    function toggleValue(value?: boolean) {
        setValue(currentValue =>
            typeof value === 'boolean' ? value : !currentValue
        );
    }

    return [value, toggleValue];
}
