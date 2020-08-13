import {IServiceCenterExtended, TServiceCenterActions} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";

type TServiceCenterState = {
    serviceCenters: IServiceCenterExtended[],
    loading: boolean,
    saving: boolean,
    paging: IPagingResponse,
    pageData: IPageRequest
};

const initialState: TServiceCenterState = {
    serviceCenters: [],
    loading: false,
    saving: false,
    paging: {...defaultPaging},
    pageData: {...defaultPageData}
};

export const serviceCenterReducer = (state=initialState, action: TServiceCenterActions): TServiceCenterState => {
    switch (action.type) {
        case "ServiceCenters/GetAll":
            return {...state, serviceCenters: action.payload};
        case "ServiceCenters/ChangePageData":
            return {...state, pageData: {...state.pageData, ...action.payload}};
        case "ServiceCenters/ChangePaging":
            return {...state, paging: action.payload};
        case "ServiceCenters/Loading":
            return {...state, loading: action.payload};
        case "ServiceCenters/Saving":
            return {...state, saving: action.payload};
        default:
            return state;
    }
};