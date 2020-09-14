import {createAction} from "@reduxjs/toolkit";
import {IServiceRequest, IServiceRequestNonAddedFilter} from "./types";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getNonSelectedServiceRequests = createAction<IServiceRequest[]>("ServiceRequests/getNonSelected");
export const setLoadingNonSelected = createAction<boolean>("ServiceRequests/loadingNonSelected");
export const setNonSelectedPaging = createAction<IPagingResponse>("ServiceRequests/NonSelectedPaging");
export const setNonSelectedPageData = createAction<Partial<IPageRequest>>("ServiceRequests/NonSelectedPageData");
export const setNonSelectedFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequests/NonSelectedFilter");

export const loadNonSelectedServiceRequests = (serviceCenterId: number): AppThunk =>
    async (dispatch, getState) => {
    const {nonSelectedFilter, nonSelectedPageData} = getState().serviceRequests;
    dispatch(setLoadingNonSelected(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IServiceRequest>>(
            Api.endpoints.ServiceRequests.GetFiltered,
            {
                data: {
                    ...nonSelectedPageData, ...nonSelectedFilter,
                    serviceCenterFilter: {
                        isAssigned: false,
                        id: serviceCenterId
                    }
                }
            }
        )
        dispatch(getNonSelectedServiceRequests(result));
        dispatch(setNonSelectedPaging(paging));
        dispatch(setLoadingNonSelected(false));
    } catch (e) {
        setLoadingNonSelected(false);
        throw e;
    }
}

export const assignServiceRequests = (serviceRequestIds: number[], serviceCenterId: number): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.ServiceRequests.AssignMultiple, {data: {serviceRequestIds, serviceCenterId}}
    );
    dispatch(loadNonSelectedServiceRequests(serviceCenterId));
}