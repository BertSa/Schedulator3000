import React from 'react';
import {Dialog} from '@mui/material';

type ProviderContext = readonly [(option: DialogParams) => number, (id?: number) => void];

const EMPTY_FUNC = () => {
};
const DialogContext = React.createContext<ProviderContext>([
    (): number => {
        return 0;
    },
    EMPTY_FUNC
]);
export const useDialog = () => React.useContext(DialogContext);

type DialogParams = {
    idDialog?: number;
    children: React.ReactNode;
    open?: boolean;
    onClose?: Function;
    onExited?: Function;
};
// type DialogOption = Omit<DialogParams, 'open'>;
type DialogContainerProps = DialogParams & {
    onClose: () => void;
    onKill: () => void;
};

function DialogContainer(props: DialogContainerProps) {
    const {children, open, onClose, onKill} = props;

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
    let id = 0;
    const createDialog = (option: DialogParams): number => {
        id++;
        const dialog = {...option, open: true, idDialog: id};
        setDialogs((dialogs) => [...dialogs, dialog]);
        return id;
    };

    const closeDialog = (id?: number) => {
        setDialogs((dialogs) => {
            let latestDialog;
            if (id) {
                let index = dialogs.findIndex((d) => d.idDialog === id);
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
            {dialogs.map((dialog, i) => {
                const {onClose, ...dialogParams} = dialog;
                const handleKill = () => {
                    if (dialog.onExited) dialog.onExited();
                    setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
                };

                // noinspection RequiredAttributes
                return (
                    <DialogContainer
                        key={i}
                        onClose={closeDialog}
                        onKill={handleKill}
                        {...dialogParams}
                    />
                );
            })}
        </DialogContext.Provider>
    );
}
