import {DealershipActions, DealershipState} from "./types";

const initialState: DealershipState = {
    dealershipList: [],
    loading: false,
    saving: false
};

export const dealershipGroupsReducer =(
    state=initialState, action: DealershipActions
): DealershipState => {
    switch (action.type) {
        case "Dealership/Add":
            return {...state, dealershipList: [
                action.payload, ...state.dealershipList
            ]};
        case "Dealership/GetAll":
            return {...state, dealershipList: action.payload};
        case "Dealership/Loading":
            return {...state, loading: action.payload};
        case "Dealership/Saving":
            return {...state, saving: action.payload};
        default:
            return state;
    }
}
