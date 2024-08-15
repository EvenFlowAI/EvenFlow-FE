import {createAction} from "@reduxjs/toolkit";
import {IPod, IPodFilters, IPodForm, IPodShort, IPodSummary, TPodOrder} from "./types";
import {
    AppThunk,
    IPageRequest,
    IPagingResponse,
    PaginatedAPIResponse,
    TArgCallback,
    TCallback
} from "../../../types/types";

import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

export const getPods = createAction<IPod[]>("Pods/GetPods");
export const setPodsLoading = createAction<boolean>("Pods/Loading");
export const setPodsPageData = createAction<Partial<IPageRequest>>("Pods/PageData");
export const setPodsPaging = createAction<IPagingResponse>("Pods/Paging");
export const setPodsFilters = createAction<Partial<IPodFilters>>("Pods/Filters");
export const getPodsShort = createAction<IPodShort[]>("Pods/GetPodsShort");
export const setSelectedPod = createAction<IPodShort|null>("Pods/SetSelectedPod");
export const setPodById = createAction<IPod|null>("Pods/SetPodById");
export const setPodsSummary = createAction<IPodSummary[]>("Pods/SetPodsSummary");

export const loadPods = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    const {podsFilters, podsPageData} = getState().pods;
    dispatch(setPodsLoading(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IPod>>(
            Api.endpoints.Pods.GetAll,
            {data: {...podsPageData, ...podsFilters, serviceCenterId}}
        );
        dispatch(getPods(result));
        dispatch(setPodsPaging(paging));
        dispatch(setPodsLoading(false));
    } catch (e) {
        dispatch(setPodsLoading(false));
        console.log('loadPods', e)
    }
}
export const createPod = (data: IPodForm): AppThunk => async dispatch => {
    try {
        await Api.call(Api.endpoints.Pods.Create, {data});
        dispatch(loadPodsSummary(data.serviceCenterId))
    } catch (err) {
        console.log('create Pod error', err)
    }
}
export const updatePod = (data: IPodForm, id: number): AppThunk => async dispatch => {
    try {
        await Api.call(Api.endpoints.Pods.Update, {data, urlParams: {id}});
        dispatch(loadPodsSummary(data.serviceCenterId))
    } catch (err) {
        console.log('update Pod error', err)
    }
}
export const removePod = (id: number, serviceCenterId?: number, onError?: TArgCallback<any>): AppThunk => async (dispatch, getState) => {
    dispatch(setPodsLoading(true))
    Api.call(Api.endpoints.Pods.Remove, {urlParams: {id}})
        .then(() => {
            if (getState().pods.selectedPod?.id === id) {
                dispatch(setSelectedPod(null));
            }
            if (serviceCenterId) {
                dispatch(loadPodsSummary(serviceCenterId))
            }
        }).catch(err => {
            onError && onError(err)
        dispatch(setPodsLoading(false))
    })
}

export const loadPodsShort = (serviceCenterId: number): AppThunk => async dispatch => {
    try {
        const {data: {result}} = await Api.call<PaginatedAPIResponse<IPodShort>>(
            Api.endpoints.Pods.GetShort,
            {data: {serviceCenterId, pageSize: 0}}
        );
        dispatch(getPodsShort(result));
    } catch (err) {
        console.log('load Pods short error', err)
    }
}

export const loadPodById = (id: number): AppThunk => async dispatch => {
    dispatch(setPodsLoading(true))
    Api.call<IPod>(Api.endpoints.Pods.Retrieve, {urlParams: {id}})
        .then(res => {
            if (res.data) dispatch(setPodById(res.data))
        })
        .catch(err => {
            console.log('get pod by id err', err)
        })
        .finally(() => dispatch(setPodsLoading(false)))
}

export const loadPodsSummary = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setPodsLoading(true))
    Api.call<IPodSummary[]>(Api.endpoints.Pods.GetSummary, {params: {serviceCenterId}})
        .then(res => {
            if (res.data) dispatch(setPodsSummary(res.data))
        })
        .catch(err => {
            console.log('get pod summary error', err)
        })
        .finally(() => dispatch(setPodsLoading(false)))
}

export const setPodsOrderIndex = (serviceCenterId: number, serviceBooks: TPodOrder[], onError: TArgCallback<any>, onSuccess: TCallback): AppThunk => dispatch => {
    dispatch(setPodsLoading(true))
    Api.call<IPodSummary[]>(Api.endpoints.Pods.SetOrderIndex, {data: {serviceCenterId, serviceBooks}})
        .then(res => {
            if (res.data) dispatch(loadPodsSummary(serviceCenterId))
            onSuccess()
        })
        .catch(err => {
            onError(err)
            console.log('set pods order index error', err)
        })
        .finally(() => dispatch(setPodsLoading(false)))
}