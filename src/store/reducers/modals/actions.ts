import {TConfirmModalPayload, TModalActions} from "./types";

export const openConfirmModal = (payload: TConfirmModalPayload): TModalActions => ({
    type: "Modals/OpenConfirm", payload
});
export const closeConfirmModal = (): TModalActions => ({
    type: "Modals/CloseConfirm"
});