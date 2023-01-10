import {
    ILaborRate,
    IPredictionParams,
    ISCAnalytics,
    IServiceCenter,
    IServiceCenterExtended,
    IServiceCenterForm,
    TServiceCenterActions
} from "./types";
import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {Api, TOptions} from "../../../config/requests";
import {AppThunk, IOrder, IPageRequest, PaginatedAPIResponse} from "../../../types/types";
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

export const setSelectedDealershipGroupId = (payload: number | undefined): TServiceCenterActions => ({
    type: "ServiceCenters/SetDealershipId", payload
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
    const requestPayload = {
        ...state.serviceCenters.pageData,
        ...state.serviceCenters.order,
        searchTerm: state.serviceCenters.searchTerm,
        dealershipId: state.serviceCenters.dealershipId
    };
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IServiceCenterExtended>>(
            Api.endpoints.ServiceCenters.GetAll,
            {data: requestPayload}
        );
        dispatch(changePaging(paging));
        dispatch(getAll(result));
        dispatch(loading(false));
    } catch (e) {
        dispatch(loading(false));
        throw e;
    }
}
export const setSCOrder = createAction<IOrder<IServiceCenterExtended>>("ServiceCenters/ChangeOrder");
export const setSCSearch = createAction<string>("ServiceCenters/SetSearch");
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
    = (dealershipId?: number) => async dispatch => {
    dispatch(shortLoading(true));
    try {
        const params = {
            pageIndex: 0,
            pageSize: 100,
            dealershipId: dealershipId ?? null,
        }
        const {data: {result}} = await Api.call<PaginatedAPIResponse<IServiceCenter>>(Api.endpoints.ServiceCenters.GetShort, {params});
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
const _selectSc = (payload: IServiceCenter|undefined): TServiceCenterActions => {
    return {type: "ServiceCenters/SelectSC", payload};
}
export const selectSC = (payload: IServiceCenter): AppThunk => dispatch => {
    localStorage.setItem(LocalItems.selectedSC, String(payload.id));
    dispatch(_selectSc(payload));
    dispatch(setSelectedPod(null));
};
export const clearSC = (): AppThunk => dispatch => {
    localStorage.removeItem(LocalItems.selectedSC);
    dispatch(_selectSc(undefined));
}
export const loadAllSCs = (): AppThunk => async (dispatch, getState) => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IServiceCenter>>(Api.endpoints.ServiceCenters.GetShort, {params: {pageSize: 0, pageIndex: 0}});
    if (result.length) {
        dispatch(_loadAllSCS(result));
        if (!getState().users.currentUser?.isSuperUser) {
            const prevSelected = localStorage.getItem(LocalItems.selectedSC);
            if (prevSelected) {
                const selected = result.find(i => i.id === Number(prevSelected));
                if (selected) {
                    dispatch(selectSC(selected));
                } else {
                    dispatch(selectSC(result[0]));
                }
            } else {
                dispatch(selectSC(result[0]))
            }
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
export const setPricingOpt = createAction<{id: number, checked: boolean}>("ServiceCenters/ApplyPricingOpt");
export const changePricingOpt = (id: number, applyPricingOptimization: boolean): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ServiceCenters.ChangePricingOpt, {urlParams: {id}, data: {applyPricingOptimization}});
    await dispatch(setPricingOpt({id, checked: applyPricingOptimization}));
}

export const setReminders = createAction<boolean>("ServiceCenters/SetReminders");
export const setRemindersLoading = createAction<boolean>("ServiceCenters/RemindersLoading");

export const loadReminders = (id: number): AppThunk => dispatch => {
    dispatch(setRemindersLoading(true));
    Api.call(Api.endpoints.ServiceCenters.GetReminders, {urlParams: {id}})
        .then(result => {
            dispatch(setReminders(result.data))
        })
        .catch(err => {
            console.log("get reminders error", err)
        })
        .finally(() => dispatch(setRemindersLoading(false)))
}

export const updateReminders = (id: number, isSendReminders: boolean, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setRemindersLoading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdateReminders, {urlParams: {id}, data: {isSendReminders}})
        .then(result => {
            if (result) {
                dispatch(loadReminders(id))
                onSuccess();
            }
        })
        .catch(err => {
            onError(err);
            console.log('update reminders error', err)
        })
        .finally(() => dispatch(setRemindersLoading(false)))
}

export const updateAuth = (id: number, isAuthRequired: boolean, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setRemindersLoading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdateAuth, {urlParams: {id}, data: {isAuthRequired}})
        .then(result => {
            if (result) {
                dispatch(loadAllSCs());
                onSuccess();
            }
        }).catch(err => {
        onError(err)
        console.log('update auth error', err)
    }).finally(() => dispatch(setRemindersLoading(false)))
}

export const updateAdvisor = (id: number, isUpdateAdvisorInAppointments: boolean, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setRemindersLoading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdateAdvisor, {urlParams: {id}, data: {isUpdateAdvisorInAppointments}})
        .then(res => {
            if (res) {
                onSuccess();
                dispatch(loadAllSCs());
            }
        })
        .catch(err => {
            console.log('update appointments advisor', err)
            onError(err);
        })
        .finally(() => dispatch(setRemindersLoading(false)));
}
export const setParamsLoading = createAction<boolean>("ServiceCenters/SetParamsLoading");
export const setPredictionParams = createAction<IPredictionParams>("ServiceCenters/SetPredictionParams")
export const loadPredictionParams = (id: number, podId?: number): AppThunk => dispatch => {
    dispatch(setParamsLoading(true));
    const data: TOptions = {urlParams: {id}}
    if (podId) data.params = {podId};
    Api.call(Api.endpoints.ServiceCenters.GetPredictionParams, data)
        .then(result => {
            if (result?.data) {
                dispatch(setPredictionParams(result.data));
            }
        })
        .catch(err => {
            console.log("load RO prediction parameters error", err)
        })
        .finally(() => dispatch(setParamsLoading(false)));
}

export const updatePredictionParams = (id: number, data: IPredictionParams, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setParamsLoading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdatePredictionParams, {urlParams: {id}, data})
        .then(result => {
            if (result?.data) {
                data.podId
                    ? dispatch(loadPredictionParams(id, data.podId))
                    : dispatch(loadPredictionParams(id));
                onSuccess();
            }
        })
        .catch(err => {
            console.log("load RO prediction parameters error", err)
            onError(err)
        })
        .finally(() => dispatch(setParamsLoading(false)));
}

export const setLaborRate = createAction<ILaborRate>("ServiceCenters/SetLaborRate")
export const loadLaborRate = (id: number): AppThunk => dispatch => {
    dispatch(setParamsLoading(true));
    Api.call(Api.endpoints.ServiceCenters.GetLaborRate, {urlParams: {id}})
        .then(result => {
            if (result?.data) dispatch(setLaborRate(result.data));
        })
        .catch(err => {
            console.log('load labor rate error', err)
        })
        .finally(() => dispatch(setParamsLoading(false)));
}

export const updateLaborRate = (id: number, data: ILaborRate, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setParamsLoading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdateLaborRate, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadLaborRate(id));
                dispatch(loadAllSCs());
                onSuccess();
            }
        })
        .catch(err => {
            console.log('update labor rate err', err)
            onError(err)
        })
}

export const updatePackageDisclaimer = (id: number, maintenancePackageDisclaimer: string, callback: () => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCenters.UpdatePackageDisclaimer, {urlParams: {id}, data: {maintenancePackageDisclaimer}})
        .then(result => {
            if (result) {
                dispatch(loadAllSCs());
                callback();
            }
        })
        .catch((error) => {
            console.log('update package disclaimer error', error)
        })
}

export const updatePackagePriceDetails = (id: number, isShowPriceDetails: boolean, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(loading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdatePackagePriceDetails, {urlParams:{id}, data: {isShowPriceDetails}})
        .then(result => {
            if (result) dispatch(loadAllSCs())
        })
        .catch(err => {
            onError(err)
        })
        .finally(() => dispatch(loading(false)))
}

export const updateDefaultRecallOpsCode = (id: number, serviceRequestId: number): AppThunk => dispatch => {
    dispatch(loading(true));
    Api.call(Api.endpoints.ServiceCenters.UpdateDefaultOpsCode, {urlParams:{id}, data: {serviceRequestId}})
        .then(result => {
            if (result) dispatch(loadAllSCs())
        })
        .catch(err => {
            console.log('update default ops code err', err)
        })
        .finally(() => dispatch(loading(false)))
}