import {createAction} from "@reduxjs/toolkit";
import {IPod, IPodFilters, IPodForm} from "./types";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getPods = createAction<IPod[]>("Pods/GetPods");
export const setPodsLoading = createAction<boolean>("Pods/Loading");
export const setPodsPageData = createAction<Partial<IPageRequest>>("Pods/PageData");
export const setPodsPaging = createAction<IPagingResponse>("Pods/Paging");
export const setPodsFilters = createAction<Partial<IPodFilters>>("Pods/Filters");

export const loadPods = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    const {podsFilters, podsPageData} = getState().pods;
    const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IPod>>(
        Api.endpoints.Pods.GetAll,
        {data: {...podsPageData, ...podsFilters, serviceCenterId}}
    );
    dispatch(getPods(result));
    setPodsPaging(paging);
}
export const createPod = (data: IPodForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Pods.Create, {data});
    dispatch(loadPods(data.serviceCenterId));
}