export type TConfirmModalPayload = {
    content?: JSX.Element | string;
    title: string;
    isRemove?: boolean;
    icon?: JSX.Element;
    confirmContent?: string;
    cancelContent?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    additionalContent?: string;
    onAdditional?: () => void;
    cancelBtnVariant?: "outlined"|"text";
    width?: number;
    isBooking?: boolean;
}
export type TOpenConfirmModal = {type: "Modals/OpenConfirm", payload: TConfirmModalPayload};
export type TCloseConfirmModal = {type: "Modals/CloseConfirm"};
export type TSetChangesModal = {type: "Modals/SetOpenChanges", payload: boolean};
export type TSetSlotsWarningModal = {type: "Modals/SetSlotsWarning", payload: boolean};
export type TSetServiceWarningModal = {type: "Modals/SetServiceWarning", payload: boolean};
export type TOpenUnavailableService = {type: "Modals/OpenUnavailableService", payload: boolean};
export type TOpenConsent = {type: "Modals/OpenConsent", payload: boolean};

export type TModalActions =
    | TCloseConfirmModal
    | TOpenConfirmModal
    | TSetChangesModal
    | TSetSlotsWarningModal
    | TSetServiceWarningModal
    | TOpenUnavailableService
    | TOpenConsent;

export type TConfirmState = {
    open: boolean;
    payload?: TConfirmModalPayload;
};

export type TModalState = {
    confirm: TConfirmState,
    isChangesCompletedOpen: boolean;
    isSlotsWarningOpen: boolean;
    isServiceWarningOpen: boolean;
    isUnavailableServiceOpen: boolean;
    isConsentOpen: boolean;
};