import React, { useCallback } from 'react';
import DialogConfirm from '../components/DialogWarningDelete';
import { useDialog } from './useDialog';

export default function useConfirmDialog() {
  const [openDialog, closeDialog] = useDialog();

  return useCallback(async (props: { title: string, text: string }) => new Promise<boolean>((resolve) => {
    openDialog(
      <DialogConfirm
        {...props}
        resolve={resolve}
        closeDialog={closeDialog}
      />,
    );
  }), []);
}
