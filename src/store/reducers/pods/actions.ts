import {createAction} from "@reduxjs/toolkit";
import {IPod, IPodFilters, IPodForm, IPodShort} from "./types";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getPods = createAction<IPod[]>("Pods/GetPods");
export const setPodsLoading = createAction<boolean>("Pods/Loading");
export const setPodsPageData = createAction<Partial<IPageRequest>>("Pods/PageData");
export const setPodsPaging = createAction<IPagingResponse>("Pods/Paging");
export const setPodsFilters = createAction<Partial<IPodFilters>>("Pods/Filters");

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
        throw e;
    }
}
export const createPod = (data: IPodForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Pods.Create, {data});
    dispatch(loadPods(data.serviceCenterId));
    dispatch(loadPodsShort(data.serviceCenterId));
}
export const updatePod = (data: IPodForm, id: number): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Pods.Update, {data, urlParams: {id}});
    dispatch(loadPods(data.serviceCenterId));
    dispatch(loadPodsShort(data.serviceCenterId))
}
export const removePod = (id: number, serviceCenterId?: number): AppThunk => async (dispatch, getState) => {
    await Api.call(Api.endpoints.Pods.Remove, {urlParams: {id}});
    if (getState().pods.selectedPod?.id === id) {
        dispatch(setSelectedPod(null));
    }
    if (serviceCenterId) {
        dispatch(loadPods(serviceCenterId));
        dispatch(loadPodsShort(serviceCenterId));
    }
}

export const getPodsShort = createAction<IPodShort[]>("Pods/GetPodsShort");
export const setSelectedPod = createAction<IPodShort|null>("Pods/SetSelectedPod");
export const loadPodsShort = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IPodShort>>(
        Api.endpoints.Pods.GetShort,
        {data: {serviceCenterId, pageSize: 0}}
    );
    dispatch(getPodsShort(result));
}