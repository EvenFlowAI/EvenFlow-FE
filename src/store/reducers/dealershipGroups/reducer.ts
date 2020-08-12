import {DealershipActions, DealershipState} from "./types";
import {defaultRowsPerPage} from "../../../config/config";

const initialState: DealershipState = {
    dealershipList: [],
    loading: false,
    saving: false,
    paging: {
        numberOfPages: 0,
        numberOfRecords: 0
    },
    pageData: {
        pageIndex: 1,
        pageSize: defaultRowsPerPage
    }
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
        case "Dealership/ChangePageData":
            return {...state, pageData: {...state.pageData, ...action.payload}};
        case "Dealership/ChangePaging":
            return {...state, paging: action.payload};
        default:
            return state;
    }
}
