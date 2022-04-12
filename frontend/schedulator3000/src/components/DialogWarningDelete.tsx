import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

export function DialogWarningDelete({resolve, closeDialog, title, text}: {resolve: any, closeDialog: any, title: string, text: string}) {
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
                console.log('delete');
            } }>Cancel</Button>
        </DialogActions>
    </>;
}
