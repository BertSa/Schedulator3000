import React, { PropsWithChildren } from 'react';
import { Dialog } from '@mui/material';

type ProviderContext = readonly [(option: DialogParams) => number, (id?: number) => void];

type DialogParams = PropsWithChildren<{
    idDialog?: number;
    open?: boolean;
    onClose?: VoidFunction;
    onExited?: VoidFunction;
}>;

type DialogContainerProps = PropsWithChildren<{
    open: boolean;
    onClose: VoidFunction;
    onEnded: VoidFunction;
}>;


const DialogContext = React.createContext<ProviderContext>({} as ProviderContext);
export const useDialog = () => React.useContext(DialogContext);

function DialogContainer({children, open, onClose, onEnded}: DialogContainerProps) {
    return (
        <Dialog open={ open }
                onClose={ onClose }
                onEnded={ onEnded }>
            { children }
        </Dialog>
    );
}

export default function DialogProvider({children}: PropsWithChildren<{}>) {
    const [dialogs, setDialogs] = React.useState<DialogParams[]>([]);
    let numberOfDialogCreated = 0;

    const createDialog = (option: DialogParams): number => {
        numberOfDialogCreated++;
        const dialog: DialogParams = {...option, open: true, idDialog: numberOfDialogCreated};
        setDialogs(dialogs => [...dialogs, dialog]);
        return numberOfDialogCreated;
    };

    const closeDialog = (idDialog?: number) => {
        setDialogs(dialogs => {
            let latestDialog;

            if (idDialog) {
                let index = dialogs.findIndex(dialog => dialog.idDialog === idDialog);
                latestDialog = dialogs.at(index);
                dialogs.splice(index, 1);
            } else {
                latestDialog = dialogs.pop();
            }

            if (!latestDialog) {
                return dialogs;
            }

            if (latestDialog.onClose) {
                latestDialog.onClose();
            }

            return [...dialogs, {...latestDialog, open: false}];
        });
    };
    const contextValue = React.useRef([createDialog, closeDialog] as const);

    return (
        <DialogContext.Provider value={ contextValue.current }>
            { children }
            { dialogs.map((dialog, index) => {
                const {onClose, ...dialogParams} = dialog;
                const handleOnEnded = () => {
                    if (dialog.onExited) {
                        dialog.onExited();
                    }
                    setDialogs(dialogs => dialogs.slice(0, dialogs.length - 1));
                };

                return (
                    <DialogContainer
                        key={index}
                        onClose={closeDialog}
                        onEnded={handleOnEnded}
                        open={dialogParams.open ?? false}>
                        {dialogParams.children}
                    </DialogContainer>
                );
            }) }
        </DialogContext.Provider>
    );
}
