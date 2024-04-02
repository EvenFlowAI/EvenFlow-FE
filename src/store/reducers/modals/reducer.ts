import {TModalActions, TModalState} from "./types";

const initialState: TModalState = {
    confirm: {open: false},
    isChangesCompletedOpen: false,
    isSlotsWarningOpen: false,
    isServiceWarningOpen: false,
    isUnavailableServiceOpen: false,
    isConsentOpen: false,
}

export const modalsReducer = (state=initialState, action: TModalActions): TModalState => {
    switch (action.type) {
        case "Modals/OpenConfirm":
            return {...state, confirm: {payload: action.payload, open: true}};
        case "Modals/CloseConfirm":
            return {...state, confirm: {open: false}};
        case "Modals/SetOpenChanges":
            return {...state, isChangesCompletedOpen: action.payload};
        case "Modals/SetSlotsWarning":
            return {...state, isSlotsWarningOpen: action.payload};
        case "Modals/SetServiceWarning":
            return {...state, isServiceWarningOpen: action.payload};
        case "Modals/OpenUnavailableService":
            return {...state, isUnavailableServiceOpen: action.payload};
        case "Modals/OpenConsent":
            return {...state, isConsentOpen: action.payload};
        default:
            return state
    }
}