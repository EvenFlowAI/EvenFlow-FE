import {createAction} from "@reduxjs/toolkit";
import {
    IAssignedServiceRequest, IRequiredSkill, IRequiredSkillData, IRequiredSkillRequest,
    IServiceRequest,
    IServiceRequestNonAddedFilter,
    IServiceRequestOverrideEditRequest
} from "./types";
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
                    status: 1, // 1 Means not archived
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
    dispatch(loadAssignedServiceRequests(serviceCenterId));
}

// Assigned Service Requests
export const getAssignedServiceRequests = createAction<IAssignedServiceRequest[]>("ServiceRequests/GetAssigned");
export const setAssignedLoading = createAction<boolean>("ServiceRequests/SetAssignedLoading");
export const setAssignedPaging = createAction<IPagingResponse>("ServiceRequests/SetAssignedPaging");
export const setAssignedPageData = createAction<Partial<IPageRequest>>("ServiceRequests/SetAssignedPageData");
export const setAssignedFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequests/SetAssignedFilter");
export const loadAssignedServiceRequests = (serviceCenterId: number): AppThunk =>
    async (dispatch, getState) => {
    const {assignedPageData, assignedFilter} = getState().serviceRequests;
    dispatch(setAssignedLoading(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequest>>(
            Api.endpoints.ServiceRequests.GetAssignedOverrides,
            {params: {...assignedPageData, ...assignedFilter, serviceCenterId}}
        );
        dispatch(getAssignedServiceRequests(result));
        dispatch(setAssignedLoading(false));
        dispatch(setAssignedPaging(paging));
    }catch (e) {
        dispatch(setAssignedLoading(false));
        throw e;
    }
}
export const updateAssignedServiceRequest = (
    data: IServiceRequestOverrideEditRequest, id: number, serviceCenterId?: number,
): AppThunk =>
    async dispatch => {
    await Api.call(Api.endpoints.ServiceRequests.EditOverrides, {data, urlParams: {id}});
    if (serviceCenterId) {
        dispatch(loadAssignedServiceRequests(serviceCenterId));
    }
}
export const setRequiredSkills = (
    requiredData: IRequiredSkillData, serviceCenterId?: number
): AppThunk => async dispatch => {
    const data: IRequiredSkillRequest = {
        requiredSkills: [requiredData]
    }
    await Api.call(Api.endpoints.ServiceRequests.EditSkills, {data});
    if (serviceCenterId) {
        dispatch(loadAssignedServiceRequests(serviceCenterId));
    }
}