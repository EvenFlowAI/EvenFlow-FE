import {TConfirmModalPayload, TModalActions} from "./types";

export type TConfirmState = {
    open: boolean;
    payload?: TConfirmModalPayload;
};

export type TModalState = {
    confirm: TConfirmState
};

const initialState: TModalState = {
    confirm: {open: false}
}

export const modalsReducer = (state=initialState, action: TModalActions): TModalState => {
    switch (action.type) {
        case "Modals/OpenConfirm":
            return {...state, confirm: {payload: action.payload, open: true}};
        case "Modals/CloseConfirm":
            return {...state, confirm: {open: false}};
        default:
            return state
    }
}