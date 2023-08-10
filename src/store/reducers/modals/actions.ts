import {TConfirmModalPayload, TModalActions} from "./types";
import {createAction} from "@reduxjs/toolkit";

export const openConfirmModal = (payload: TConfirmModalPayload): TModalActions => ({
    type: "Modals/OpenConfirm", payload
});
export const closeConfirmModal = (): TModalActions => ({
    type: "Modals/CloseConfirm"
});

export const setSlotsWarningOpen = createAction<boolean>("Modals/SetSlotsWarning");
export const setChangesCompletedOpen = createAction<boolean>("Modals/SetOpenChanges");