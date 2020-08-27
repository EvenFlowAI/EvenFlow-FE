import {IServiceCenter, IServiceCenterExtended, IServiceCenterForm, TServiceCenterActions} from "./types";
import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {Api} from "../../../config/requests";
import {IPageRequest, PaginatedAPIResponse} from "../../../types/types";
import {changePageDataGeneric, changePagingGeneric} from "../utils";

const getAll = (payload: IServiceCenterExtended[]): TServiceCenterActions => ({
   type: "ServiceCenters/GetAll", payload
});

export const loading = (payload: boolean): TServiceCenterActions => ({
    type: "ServiceCenters/Loading", payload
});
export const saving = (payload: boolean): TServiceCenterActions => ({
    type: "ServiceCenters/Saving", payload
});
export const changePaging = changePagingGeneric("ServiceCenters/ChangePaging");
const _changePageData = changePageDataGeneric("ServiceCenters/ChangePageData");
export const changePageData: ActionCreator<ThunkAction<void, RootState, void, Action>> =
    (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(_changePageData(payload));
        dispatch(loadAll());
    }
}

export const loadAll: ActionCreator<
    ThunkAction<void, RootState, void, Action
>> = () => async (dispatch, getState) => {
    dispatch(loading(true));
    const state = getState();
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IServiceCenterExtended>>(
            Api.endpoints.ServiceCenters.GetAll,
            {data: state.serviceCenters.pageData}
        );
        dispatch(changePaging(paging));
        dispatch(getAll(result));
        dispatch(loading(false));
    } catch (e) {
        dispatch(loading(false));
        throw e;
    }
}
//
// const _create = (payload: IServiceCenterExtended): TServiceCenterActions => ({
//     type: "ServiceCenters/Create", payload
// });
export const createSC: ActionCreator<
    ThunkAction<void, RootState, void, TServiceCenterActions>
> = (payload: IServiceCenterForm) => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call<IServiceCenterExtended>(
            Api.endpoints.ServiceCenters.Create, {data: payload}
        );
        dispatch(loadAll());
        dispatch(saving(false));
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}
const shortLoading = (payload: boolean): TServiceCenterActions => ({
    type: "ServiceCenters/ShortLoading", payload
});
const _loadShortSC = (payload: IServiceCenter[]): TServiceCenterActions => ({
    type: "ServiceCenters/GetShort", payload
});
export const loadShortSC: ActionCreator<ThunkAction<void, RootState, void, TServiceCenterActions>>
    = () => async dispatch => {
    dispatch(shortLoading(true));
    try {
        const {data: {result}} = await Api.call<PaginatedAPIResponse<IServiceCenter>>(Api.endpoints.ServiceCenters.GetShort, {params: {
            pageIndex: 0, pageSize: 100}});
        dispatch(_loadShortSC(result));
        dispatch(shortLoading(false));
    } catch (e) {
        dispatch(shortLoading(false));
        throw e;
    }
}

export const removeSC: ActionCreator<
    ThunkAction<void, RootState, void, TServiceCenterActions>
> = (serviceCenterId: number) => async (dispatch) => {
    try {
        await Api.call(Api.endpoints.ServiceCenters.Remove, {urlParams: {id: serviceCenterId}});
        dispatch(loadAll())
    } catch (e) {
        throw e;
    }
}