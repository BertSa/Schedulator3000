import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import { OneOf } from '../models/OneOf';

interface IDialogWarningDeleteProps {
  resolve: (value: OneOf<boolean, PromiseLike<boolean>>) => void;
  closeDialog: VoidFunction;
  title: string;
  text: string;
}

export default function DialogWarningDelete({ resolve, closeDialog, title, text }: IDialogWarningDeleteProps) {
  return (
    <>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="contained"
          onClick={() => {
            resolve(false);
            closeDialog();
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            resolve(true);
            closeDialog();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
