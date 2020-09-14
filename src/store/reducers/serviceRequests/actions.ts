import {createAction} from "@reduxjs/toolkit";
import {IServiceRequest} from "./types";
import {AppThunk, IPageRequest, IPagingResponse} from "../../../types/types";

export const getNonSelectedServiceRequests = createAction<IServiceRequest[]>("ServiceRequests/getNonSelected");
export const setLoadingNonSelected = createAction<boolean>("ServiceRequests/loadingNonSelected");
export const setNonSelectedPaging = createAction<IPagingResponse>("ServiceRequests/NonSelectedPaging");
export const setNonSelectedPageData = createAction<Partial<IPageRequest>>("ServiceRequests/NonSelectedPageData");

export const loadNonSelectedServiceRequests = (serviceCenterId: number): AppThunk => async dispatch => {

}