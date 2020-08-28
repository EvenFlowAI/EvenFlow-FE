import {IServiceCenter, IServiceCenterExtended, IServiceCenterForm, TServiceCenterActions} from "./types";
import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {Api} from "../../../config/requests";
import {AppThunk, IPageRequest, PaginatedAPIResponse} from "../../../types/types";
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

export const loadAll: ActionCreator<AppThunk> = () => async (dispatch, getState) => {
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
export const saveAvatar = (avatar: File, id: number): AppThunk => async (dispatch) => {
    const data = new FormData();
    data.append("file", avatar, avatar?.name || "");
    await Api.call(Api.endpoints.ServiceCenters.Avatar, {
        urlParams: {id}, data
    });
}
export const createSC = (payload: IServiceCenterForm, avatar: File | null): AppThunk => async (dispatch) => {
    dispatch(saving(true));
    try {
        const {data} = await Api.call<IServiceCenterExtended>(
            Api.endpoints.ServiceCenters.Create, {data: payload}
        );
        if (avatar) {
            await dispatch(saveAvatar(avatar, data.id));
        }
        dispatch(saving(false));
        dispatch(loadAll());
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

export const removeSC: ActionCreator<AppThunk> = (serviceCenterId: number) => async (dispatch) => {
    try {
        await Api.call(Api.endpoints.ServiceCenters.Remove, {urlParams: {id: serviceCenterId}});
        dispatch(loadAll())
    } catch (e) {
        throw e;
    }
}

export const updateSC = (payload: IServiceCenterForm, id: number, avatar: File | null): AppThunk => async (dispatch) => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.ServiceCenters.Update, {
            urlParams: {id},
            data: payload
        });
        if (avatar) {
            await dispatch(saveAvatar(avatar, id));
        }
        dispatch(saving(false));
        dispatch(loadAll());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}