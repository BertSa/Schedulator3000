import React, { PropsWithChildren, ReactNode, useCallback, useEffect } from 'react';
import { Dialog } from '@mui/material';

type DialogParams = PropsWithChildren<{
  idDialog?: number;
  open?: boolean;
  onClose?: VoidFunction;
  onExited?: VoidFunction;
}>;

type ProviderContext = readonly [(option: DialogParams) => void, (id?: number) => void];

type DialogContainerProps = PropsWithChildren<{
  open: boolean;
  onClose: VoidFunction;
  onEnded: VoidFunction;
}>;

let id = 0;

const DialogContext = React.createContext<ProviderContext>({} as ProviderContext);

export function useDialog(): [(container: ReactNode, onExited?: VoidFunction) => void, VoidFunction] {
  const [createDialog, closeDialog] = React.useContext(DialogContext);
  let idDialog: number = -1;

  const handleOpen = useCallback(
    (container: ReactNode, onExited?: VoidFunction) => {
      idDialog = ++id as number;
      createDialog({
        children: container,
        onExited,
        idDialog,
      });
    },
    [createDialog],
  );

  const handleClose = useCallback(() => {
    closeDialog(idDialog);
  }, [closeDialog, idDialog]);

  return [handleOpen, handleClose];
}

function DialogContainer({ children, open, onClose, onEnded }: DialogContainerProps) {
  return (
    <Dialog open={open} onClose={onClose} onEnded={onEnded}>
      {children}
    </Dialog>
  );
}

export default function DialogProvider({ children }: PropsWithChildren<{}>) {
  const [dialogs, setDialogs] = React.useState<DialogParams[]>([]);
  const [dialogsToRemove, setDialogsToRemove] = React.useState<number[]>([]);

  useEffect(() => {
    function removeDialog() {
      if (dialogsToRemove.length > 0) {
        setDialogs((dial) =>
          dial.map((dialog) => {
            if (dialog?.idDialog !== undefined && dialogsToRemove.indexOf(dialog.idDialog) !== -1) {
              return { ...dialog, open: false };
            }
            return dialog;
          }),
        );
        setDialogsToRemove([]);
      }
    }

    removeDialog();
  }, [dialogsToRemove]);

  function createDialog(option: DialogParams): void {
    return setDialogs((dial) => [...dial, { ...option, open: true }]);
  }

  function closeDialog(idDialog?: number): void {
    setDialogsToRemove((dial) => {
      if (idDialog === undefined) {
        const id = dialogs[dialogs.length - 1]?.idDialog;
        if (id === undefined) {
          return dial;
        }

        return [...dial, id];
      }

      return [...dial, idDialog];
    });
  }

  const contextValue = React.useRef([createDialog, closeDialog] as const);

  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map((dialog) => {
        const { onClose, ...dialogParams } = dialog;

        const handleOnEnded = () => {
          if (dialog.onExited) {
            dialog.onExited();
          }
          setDialogs((dial) => dial.slice(0, dial.length - 1));
        };

        return (
          <DialogContainer key={dialog.idDialog} onClose={() => closeDialog()} onEnded={handleOnEnded} open={dialogParams.open ?? false}>
            {dialogParams.children}
          </DialogContainer>
        );
      })}
    </DialogContext.Provider>
  );
}
