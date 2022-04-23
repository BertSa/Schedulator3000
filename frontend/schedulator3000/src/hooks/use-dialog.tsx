import React, { PropsWithChildren, ReactNode, useCallback, useEffect } from 'react';
import { Dialog } from '@mui/material';

type ProviderContext = readonly [(option: DialogParams) => void, (id?: number) => void];

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


function* idGenerator() {
    let id = 1;
    while (true) {
        yield id++;
    }
}

const generator: Generator<number, void> = idGenerator();

const DialogContext = React.createContext<ProviderContext>({} as ProviderContext);

export function useDialog(): [(container: ReactNode, onExited?: VoidFunction) => void, VoidFunction] {
    const [createDialog, closeDialog] = React.useContext(DialogContext);
    let idDialog: number = -1;

    const handleOpen = useCallback((container: ReactNode, onExited?: VoidFunction) => {
        idDialog = generator.next().value as number;
        createDialog({
            children: container,
            onExited: onExited,
            idDialog: idDialog,
        });
    }, [createDialog]);

    const handleClose = useCallback(() => {
        closeDialog(idDialog);
    }, [closeDialog, idDialog]);


    return [handleOpen, handleClose];
}

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
    const [dialogsToRemove, setDialogsToRemove] = React.useState<number[]>([]);

    useEffect(() => {
        function removeDialog() {
            if (dialogsToRemove.length > 0) {
                setDialogs((dialogs) => dialogs.map(dialog => {
                    if (dialog?.idDialog !== undefined && dialogsToRemove.indexOf(dialog.idDialog) !== -1) {
                        return {...dialog, open: false};
                    }
                    return dialog;
                }));
                setDialogsToRemove([]);
            }
        }

        removeDialog();
    }, [dialogsToRemove]);


    function createDialog(option: DialogParams): void {
        return setDialogs(dialogs => [...dialogs, {...option, open: true}]);
    }

    function closeDialog(idDialog?: number): void {
        setDialogsToRemove(dialogsToRemove => {
            if (idDialog === undefined) {
                const id = dialogs[dialogs.length - 1]?.idDialog;
                if (id === undefined) {
                    return dialogsToRemove;
                }

                return [...dialogsToRemove, id];
            }

            return [...dialogsToRemove, idDialog];
        });
    }

    const contextValue = React.useRef([createDialog, closeDialog] as const);

    return (
        <DialogContext.Provider value={ contextValue.current }>
            { children }
            { dialogs.map((dialog, index) => {
                const {onClose, ...dialogParams} = dialog;

                function handleOnEnded() {
                    if (dialog.onExited) {
                        dialog.onExited();
                    }
                    setDialogs(dialogs => dialogs.slice(0, dialogs.length - 1));
                }

                return (
                    <DialogContainer
                        key={ index }
                        onClose={ () => closeDialog() }
                        onEnded={ handleOnEnded }
                        open={ dialogParams.open ?? false }>
                        { dialogParams.children }
                    </DialogContainer>
                );
            }) }
        </DialogContext.Provider>
    );
}

