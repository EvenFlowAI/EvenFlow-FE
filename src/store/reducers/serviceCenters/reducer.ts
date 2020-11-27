import {IServiceCenter, IServiceCenterExtended, TServiceCenterActions} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {EDay} from "../demandSegments/types";
import {getWorkingDays} from "./actions";

type TServiceCenterState = {
    serviceCenters: IServiceCenterExtended[],
    dealershipSCs: IServiceCenterExtended[],
    fullSCList: IServiceCenter[],
    selectedSC?: IServiceCenter,
    shortSC: IServiceCenter[],
    loading: boolean,
    dealershipLoading: boolean,
    shortLoading: boolean,
    saving: boolean,
    paging: IPagingResponse,
    dealershipPaging: IPagingResponse,
    pageData: IPageRequest,
    workingDays: EDay[]
};

const initialState: TServiceCenterState = {
    serviceCenters: [],
    dealershipSCs: [],
    fullSCList: [],
    shortSC: [],
    shortLoading: false,
    dealershipLoading: false,
    loading: false,
    saving: false,
    paging: {...defaultPaging},
    dealershipPaging: {...defaultPaging},
    pageData: {...defaultPageData},
    workingDays: [],
};

export const serviceCenterReducer = (state=initialState, action: TServiceCenterActions): TServiceCenterState => {
    switch (action.type) {
        case "ServiceCenters/GetAll":
            return {...state, serviceCenters: action.payload};
        case "ServiceCenters/ChangeDealershipPaging":
            return {...state, dealershipPaging: action.payload};
        case "ServiceCenters/DealershipLoading":
            return {...state, dealershipLoading: action.payload};
        case "ServiceCenters/GetDealershipAll":
            return {...state, dealershipSCs: action.payload};
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
        case "ServiceCenters/FullSCList":
            return {...state, fullSCList: action.payload};
        case "ServiceCenters/SelectSC":
            return {...state, selectedSC: action.payload};
        case getWorkingDays.type:
            if (getWorkingDays.match(action)) {
                return {...state, workingDays: action.payload};
            }
            return state;
        default:
            return state;
    }
};