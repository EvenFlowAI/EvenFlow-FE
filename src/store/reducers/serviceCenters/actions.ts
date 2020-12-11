import {ISCAnalytics, IServiceCenter, IServiceCenterExtended, IServiceCenterForm, TServiceCenterActions} from "./types";
import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {Api} from "../../../config/requests";
import {AppThunk, IPageRequest, PaginatedAPIResponse} from "../../../types/types";
import {changePageDataGeneric, changePagingGeneric} from "../utils";
import {LocalItems} from "../../../config/constants";
import {setSelectedPod} from "../pods/actions";
import {createAction} from "@reduxjs/toolkit";
import {EDay} from "../demandSegments/types";

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
export const saveAvatar = (avatar: File, id: number): AppThunk => async () => {
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
        dispatch(loadAllSCs());
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
        dispatch(loadAllSCs());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}

const loadingDealership = (payload: boolean): TServiceCenterActions => ({type: "ServiceCenters/DealershipLoading", payload});
const pagingDealership = changePagingGeneric("ServiceCenters/ChangeDealershipPaging");
const _loadDealershipSCs = (payload: IServiceCenterExtended[]): TServiceCenterActions => ({type: "ServiceCenters/GetDealershipAll", payload});
export const loadDealershipSCs = (dealershipId: number, pageData: IPageRequest): AppThunk => async dispatch => {
    dispatch(loadingDealership(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IServiceCenterExtended>>(Api.endpoints.ServiceCenters.GetAll, {data: {
            dealershipId, ...pageData
        }});
        dispatch(pagingDealership(paging));
        dispatch(_loadDealershipSCs(result));
        dispatch(loadingDealership(false));
    } catch (e) {
        dispatch(loadingDealership(false));
        throw e;
    }
}
const _loadAllSCS = (payload: IServiceCenter[]): TServiceCenterActions => ({type: "ServiceCenters/FullSCList", payload});
const _selectSc = (payload: IServiceCenter): TServiceCenterActions => {
    return {type: "ServiceCenters/SelectSC", payload};
}
export const selectSC = (payload: IServiceCenter): AppThunk => dispatch => {
    localStorage.setItem(LocalItems.selectedSC, String(payload.id));
    dispatch(_selectSc(payload));
    dispatch(setSelectedPod(null));
};
export const loadAllSCs = (): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IServiceCenter>>(Api.endpoints.ServiceCenters.GetShort, {params: {pageSize: 0, pageIndex: 0}});
    if (result.length) {
        dispatch(_loadAllSCS(result));
        const prevSelected = localStorage.getItem(LocalItems.selectedSC);
        if (prevSelected) {
            const selected = result.find(i => i.id === Number(prevSelected));
            if (selected) {
                dispatch(selectSC(selected));
            } else {
                dispatch(selectSC(result[0]))
            }
        } else {
            dispatch(selectSC(result[0]))
        }
    }
}
export const getWorkingDays = createAction<EDay[]>("ServiceCenters/WorkingDays");
export const loadWorkingDays = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<EDay[]>(
        Api.endpoints.ServiceCenters.WorkingDays,
        {urlParams: {id: serviceCenterId}}
    );
    dispatch(getWorkingDays(data));
}
export const getSCAnalytics = createAction<ISCAnalytics>("ServiceCenters/Analytics");
export const loadSCAnalytics = (id: number): AppThunk => async dispatch => {
    const {data} = await Api.call<ISCAnalytics>(
        Api.endpoints.ServiceCenters.Analytics,
        {urlParams: {id}}
    );
    dispatch(getSCAnalytics(data));
}