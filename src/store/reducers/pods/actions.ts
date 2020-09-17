import {createAction} from "@reduxjs/toolkit";
import {IPod, IPodFilters} from "./types";
import {AppThunk, IPageRequest, IPagingResponse} from "../../../types/types";

export const getPods = createAction<IPod[]>("Pods/GetPods");
export const setPodsLoading = createAction<boolean>("Pods/Loading");
export const setPodsPageData = createAction<Partial<IPageRequest>>("Pods/PageData");
export const setPodsPaging = createAction<IPagingResponse>("Pods/Paging");
export const setPodsFilters = createAction<Partial<IPodFilters>>("Pods/Filters");

export const loadPods = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {

}