export type TConfirmModalPayload = {
    content?: JSX.Element | string;
    title: string;
    isRemove?: boolean;
    icon?: JSX.Element;
    confirmContent?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}
export type TOpenConfirmModal = {type: "Modals/OpenConfirm", payload: TConfirmModalPayload};
export type TCloseConfirmModal = {type: "Modals/CloseConfirm"};

export type TModalActions =
    | TCloseConfirmModal
    | TOpenConfirmModal;
