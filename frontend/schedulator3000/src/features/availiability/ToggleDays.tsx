import React, { useRef } from 'react';
import { styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';

const DAYS = [
  {
    key: 'sunday',
    label: 'S',
  },
  {
    key: 'monday',
    label: 'M',
  },
  {
    key: 'tuesday',
    label: 'T',
  },
  {
    key: 'wednesday',
    label: 'W',
  },
  {
    key: 'thursday',
    label: 'T',
  },
  {
    key: 'friday',
    label: 'F',
  },
  {
    key: 'saturday',
    label: 'S',
  },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  grouped: {
    margin: 2,
    padding: 2,
    '&:not(:first-child)': {
      border: '1px solid',
      borderColor: '#692B7C',
      borderRadius: '50%',
    },
    '&:first-child': {
      border: '1px solid',
      borderColor: '#692B7C',
      borderRadius: '50%',
    },
  },
}));

const StyledToggle = styled(ToggleButton)({
  root: {
    color: '#692B7C',
    borderRadius: '50%',
    '&$selected': {
      color: 'white',
      background: '#692B7C',
    },
    '&:hover': {
      borderColor: '#BA9BC3',
      background: '#BA9BC3',
    },
    '&:hover$selected': {
      borderColor: '#BA9BC3',
      background: '#BA9BC3',
    },
    minWidth: 32,
    maxWidth: 32,
    height: 32,
    textTransform: 'unset',
    fontSize: '0.75rem',
  },
  selected: {},
});

export default function ToggleDays
<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  { value, onChange }: ControllerRenderProps<TFieldValues, TName>) {
  const defaultValue = useRef([...(value as number[])]);

  return (
    <StyledToggleButtonGroup
      size="small"
      arial-label="Days of the week"
      value={value}
      onChange={(event: any, val: number[]) => onChange([...new Set([...val, ...defaultValue.current])])}
    >
      {DAYS.map((day, index) => (
        <StyledToggle key={day.key} value={index} aria-label={day.key}>
          {day.label}
        </StyledToggle>
      ))}
    </StyledToggleButtonGroup>
  );
}
