export type TConfirmModalPayload = {
    content?: JSX.Element | string;
    title: string;
    isRemove?: boolean;
    icon?: JSX.Element;
    confirmContent?: string;
    cancelContent?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}
export type TOpenConfirmModal = {type: "Modals/OpenConfirm", payload: TConfirmModalPayload};
export type TCloseConfirmModal = {type: "Modals/CloseConfirm"};
export type TSetChangesModal = {type: "Modals/SetOpenChanges", payload: boolean};
export type TSetSlotsWarningModal = {type: "Modals/SetSlotsWarning", payload: boolean};

export type TModalActions =
    | TCloseConfirmModal
    | TOpenConfirmModal
    | TSetChangesModal
    | TSetSlotsWarningModal;
