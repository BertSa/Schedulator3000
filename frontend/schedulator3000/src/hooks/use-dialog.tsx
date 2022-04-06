import React from 'react';
import {Dialog} from '@mui/material';

type ProviderContext = readonly [(option: DialogParams) => number, (id?: number) => void];

type DialogParams = {
    idDialog?: number;
    children: React.ReactNode;
    open?: boolean;
    onClose?: Function;
    onExited?: Function;
};

type DialogContainerProps = DialogParams & {
    onClose: () => void;
    onKill: () => void;
};


const DialogContext = React.createContext<ProviderContext>([
    (): number => {
        return 0;
    },
    () => {
    }
]);
export const useDialog = () => React.useContext(DialogContext);

function DialogContainer({children, open, onClose, onKill}: DialogContainerProps) {
    return (
        <Dialog open={open ?? false}
                onClose={onClose}
                onEnded={onKill}>
            {children}
        </Dialog>
    );
}

export default function DialogProvider({children}: { children: React.ReactNode }) {
    const [dialogs, setDialogs] = React.useState<DialogParams[]>([]);
    let numberOfDialogCreated = 0;

    const createDialog = (option: DialogParams): number => {
        numberOfDialogCreated++;
        const dialog = {...option, open: true, idDialog: numberOfDialogCreated};
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
        <DialogContext.Provider value={contextValue.current}>
            {children}
            {dialogs.map((dialog, index) => {
                const {onClose, ...dialogParams} = dialog;
                const handleKill = () => {
                    if (dialog.onExited) {
                        dialog.onExited();
                    }
                    setDialogs(dialogs => dialogs.slice(0, dialogs.length - 1));
                };

                // noinspection RequiredAttributes
                return (
                    <DialogContainer
                        key={index}
                        onClose={closeDialog}
                        onKill={handleKill}
                        {...dialogParams}
                    />
                );
            })}
        </DialogContext.Provider>
    );
}
