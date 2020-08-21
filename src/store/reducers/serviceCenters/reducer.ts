import {IServiceCenter, IServiceCenterExtended, TServiceCenterActions} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";

type TServiceCenterState = {
    serviceCenters: IServiceCenterExtended[],
    shortSC: IServiceCenter[],
    loading: boolean,
    shortLoading: boolean,
    saving: boolean,
    paging: IPagingResponse,
    pageData: IPageRequest
};

const initialState: TServiceCenterState = {
    serviceCenters: [],
    shortSC: [],
    shortLoading: false,
    loading: false,
    saving: false,
    paging: {...defaultPaging},
    pageData: {...defaultPageData}
};

export const serviceCenterReducer = (state=initialState, action: TServiceCenterActions): TServiceCenterState => {
    switch (action.type) {
        case "ServiceCenters/GetAll":
            return {...state, serviceCenters: action.payload};
        case "ServiceCenters/GetShort":
            return {...state, shortSC: action.payload};
        case "ServiceCenters/ShortLoading":
            return {...state, shortLoading: action.payload};
        case "ServiceCenters/Create":
            return {...state, serviceCenters: [action.payload, ...state.serviceCenters]};
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