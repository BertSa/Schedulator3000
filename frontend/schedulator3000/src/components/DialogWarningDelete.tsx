import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface DialogWarningDeleteProps {
    resolve:  (value: (boolean | PromiseLike<boolean>)) => void,
    closeDialog: VoidFunction,
    title: string,
    text: string
}

export default function DialogWarningDelete({resolve, closeDialog, title, text}: DialogWarningDeleteProps) {
    return <>
        <DialogTitle id="alert-dialog-title">
            { title }
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                { text }
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={ () => {
                resolve(false);
                closeDialog();
            } } variant="contained" autoFocus>
                Confirm
            </Button>
            <Button onClick={ () => {
                resolve(true);
                closeDialog();
            } }>Cancel</Button>
        </DialogActions>
    </>;
}
