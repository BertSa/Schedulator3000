import React, { MouseEventHandler, useState } from 'react';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { Check, Edit } from '@mui/icons-material';
import useToggle from '../../../hooks/use-toggle';

interface EditableTextFieldProps { defaultValue: string, onConfirm: (value: string) => void, textHelper:string }
export default function EditableTextField({ defaultValue, onConfirm, textHelper }: EditableTextFieldProps) {
  const [editMode, toggleEditMode] = useToggle(false);
  const [value, setValue] = useState<string>(defaultValue);
  const [previous, setPrevious] = useState<string>(defaultValue);

  const confirmEdit: MouseEventHandler = (e) => {
    e.preventDefault();
    setPrevious(value);
    toggleEditMode(false);
    onConfirm(value);
  };

  const cancelEdit = () => {
    setValue(previous);
    toggleEditMode(false);
  };

  return (
    <div>
      <TextField
        name="editable-text-field"
        value={value}
        defaultValue=""
        label="Note"
        multiline
        variant="filled"
        InputLabelProps={{ shrink: true }}
        helperText={textHelper}
        onChange={(e) => setValue(e.target.value)}
        disabled={!editMode}
        onBlur={cancelEdit}
        InputProps={{
          // eslint-disable-next-line no-nested-ternary
          endAdornment: editMode ? (
            <InputAdornment position="end">
              <IconButton onMouseDown={confirmEdit}>
                <Check />
              </IconButton>
            </InputAdornment>
          ) : (
            <InputAdornment position="end">
              <Tooltip title="Edit">
                <IconButton onClick={() => toggleEditMode(true)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
