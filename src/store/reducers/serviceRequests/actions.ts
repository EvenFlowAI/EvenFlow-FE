import {createAction} from "@reduxjs/toolkit";
import {
    EServiceStatus,
    IAssignedServiceRequest,
    IAssignedServiceRequestShort,
    IPrioritizeRequest,
    IRequiredSkillData,
    IRequiredSkillRequest,
    IServiceRequest,
    IServiceRequestNonAddedFilter,
    IServiceRequestOverrideEditRequest,
    IServiceRequestPriority,
    IUpsellServiceRequest, IUpsellServiceRequestUpdate
} from "./types";
import {
    AppThunk,
    IOrder,
    IPageRequest,
    IPagingResponse,
    PaginatedAPIResponse,
    TArgCallback
} from "../../../types/types";
import {EPricingDisplayType} from "../pricingSettings/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

export const getNonSelectedServiceRequests = createAction<IServiceRequest[]>("ServiceRequestsScreen/getNonSelected");
export const setLoadingNonSelected = createAction<boolean>("ServiceRequestsScreen/loadingNonSelected");
export const setNonSelectedPaging = createAction<IPagingResponse>("ServiceRequestsScreen/NonSelectedPaging");
export const setNonSelectedOrder = createAction<IOrder<IServiceRequest>>("ServiceRequestsScreen/NonSelectedOrder");
export const setNonSelectedPageData = createAction<Partial<IPageRequest>>("ServiceRequestsScreen/NonSelectedPageData");
export const setNonSelectedFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequestsScreen/NonSelectedFilter");
export const setServiceRequestsPageActiveTab = createAction<string>("ServiceRequestsScreen/SetServiceRequestsPageActiveTab");

export const loadNonSelectedServiceRequests = (serviceCenterId: number, isAssigned?: boolean): AppThunk =>
    async (dispatch, getState) => {
    const {nonSelectedFilter, nonSelectedPageData, nonSelectedOrder} = getState().serviceRequests;
    dispatch(setLoadingNonSelected(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IServiceRequest>>(
            Api.endpoints.ServiceRequests.GetFiltered,
            {
                data: {
                    ...nonSelectedPageData, ...nonSelectedFilter,
                    ...nonSelectedOrder,
                    status: EServiceStatus.None,
                    serviceCenterId
                }
            }
        )
        dispatch(getNonSelectedServiceRequests(result));
        dispatch(setNonSelectedPaging(paging));
        dispatch(setLoadingNonSelected(false));
    } catch (e) {
        setLoadingNonSelected(false);
        console.log('loadNonSelectedServiceRequests', e)
    }
}

export const assignServiceRequests = (
    serviceRequestIds: number[],
    serviceCenterId: number,
    onError: TArgCallback<string>,
    onSuccess: TArgCallback<number[]>,
): AppThunk => dispatch => {
    Api.call(
        Api.endpoints.ServiceRequests.AssignMultiple, {data: {serviceRequestIds, serviceCenterId}}
    )
        .then(result => {
            if (result) {
                dispatch(loadNonSelectedServiceRequests(serviceCenterId));
                dispatch(loadAssignedServiceRequests(serviceCenterId));
                onSuccess(serviceRequestIds);
            }
        })
        .catch(err => {
            onError(err)
        })
}

// Assigned Service Requests
export const getAssignedServiceRequests = createAction<IAssignedServiceRequest[]>("ServiceRequestsScreen/GetAssigned");
export const getAllAssignedServiceRequests = createAction<IAssignedServiceRequest[]>("ServiceRequestsScreen/GetAllAssigned");
export const setAssignedLoading = createAction<boolean>("ServiceRequestsScreen/SetAssignedLoading");
export const setAssignedPaging = createAction<IPagingResponse>("ServiceRequestsScreen/SetAssignedPaging");
export const setAssignedPageData = createAction<Partial<IPageRequest>>("ServiceRequestsScreen/SetAssignedPageData");
export const setAssignedFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequestsScreen/SetAssignedFilter");
export const setAssignedOrdering = createAction<IOrder<IAssignedServiceRequest>>("ServiceRequestsScreen/SetAssignedOrder");

export const loadAssignedServiceRequests = (serviceCenterId: number, isEligible?: boolean): AppThunk =>
    async (dispatch, getState) => {
    const {assignedPageData, assignedFilter, assignedOrdering} = getState().serviceRequests;
    dispatch(setAssignedLoading(true));
    const pricingDisplayType = isEligible ? EPricingDisplayType.Dynamic : null;
    const params = {...assignedPageData, ...assignedFilter, ...assignedOrdering, serviceCenterId, pricingDisplayType};

    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequest>>(
            Api.endpoints.ServiceRequests.GetAssignedOverrides, {params});
        dispatch(getAssignedServiceRequests(result));
        dispatch(setAssignedLoading(false));
        dispatch(setAssignedPaging(paging));
    }catch (e) {
        dispatch(setAssignedLoading(false));
        console.log('loadAssignedServiceRequests', e)
    }
}

export const loadAllAssignedServiceRequests = (serviceCenterId: number): AppThunk => (dispatch, getState) => {
    dispatch(setAssignedLoading(true));
    const {assignedFilter} = getState().serviceRequests;
    Api.call(
        Api.endpoints.ServiceRequests.GetAssignedOverrides,
        {params: {pageIndex: 0, pageSize: 0, serviceCenterId, ...assignedFilter}}
    )
        .then(result => {
            if (result?.data?.result) dispatch(getAllAssignedServiceRequests(result.data.result));
        })
        .catch(err => {
            console.log('get all assigned requests error', err)
        })
        .finally(() => dispatch(setAssignedLoading(false)));
}

export const updateAssignedServiceRequest = (
    data: IServiceRequestOverrideEditRequest, id: number, serviceCenterId?: number, onSuccess?: () => void, onError?: (err: string) => void
): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceRequests.EditOverrides, {data, urlParams: {id}})
        .then(res => {
            if (res) {
                onSuccess && onSuccess()
                if (serviceCenterId) {
                    dispatch(loadAssignedServiceRequests(serviceCenterId));
                }
            }
        })
        .catch(err => {
            onError && onError(err)
            console.log('update assigned service request error', err)
        })
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

export const getUrgentServiceRequests = createAction<IAssignedServiceRequestShort[]>("ServiceRequestsScreen/getUrgent");
export const loadingUrgentServiceRequests = createAction<boolean>("ServiceRequestsScreen/loadingUrgent");
export const pagingUrgentServiceRequests = createAction<IPagingResponse>("ServiceRequestsScreen/pagingUrgent");
export const pageDataUrgentServiceRequests = createAction<Partial<IPageRequest>>("ServiceRequestsScreen/pageDataUrgent");

export const loadUrgentServiceRequests = (serviceCenterId: number, podId?: number): AppThunk =>
async (dispatch, getState) => {
    const pageData = getState().serviceRequests.urgentPageData;
    dispatch(loadingUrgentServiceRequests(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequestShort>>(
            Api.endpoints.ServiceRequests.GetShort, {
                params: {serviceCenterId, podId, ...pageData, priority: IServiceRequestPriority.Urgent}
            }
        );
        dispatch(loadingUrgentServiceRequests(false));
        dispatch(getUrgentServiceRequests(result));
        dispatch(pagingUrgentServiceRequests(paging));
    } catch (e) {
        dispatch(loadingUrgentServiceRequests(false));
        console.log('loadUrgentServiceRequests', e)
    }
}
export const setUrgentRequests = (ids: number[], serviceCenterId?: number, podId?: number): AppThunk => async dispatch => {
    const data: IPrioritizeRequest = {
        podId: podId,
        items: ids.map(id => ({id, priority: IServiceRequestPriority.Urgent}))
    }
    await Api.call(
        Api.endpoints.ServiceRequests.Prioritize, {data}
    );
    if (serviceCenterId) {
        dispatch(loadNonUrgentServiceRequests(serviceCenterId, podId));
        dispatch(loadUrgentServiceRequests(serviceCenterId, podId));
    }
}

export const getNonUrgentServiceRequests = createAction<IAssignedServiceRequestShort[]>("ServiceRequestsScreen/getNonUrgent");
export const loadingNonUrgentServiceRequests = createAction<boolean>("ServiceRequestsScreen/loadingNonUrgent");
export const pagingNonUrgentServiceRequests = createAction<IPagingResponse>("ServiceRequestsScreen/pagingNonUrgent");
export const pageDataNonUrgentServiceRequests = createAction<Partial<IPageRequest>>("ServiceRequestsScreen/pageDataNonUrgent");

export const loadNonUrgentServiceRequests = (serviceCenterId: number, podId?: number): AppThunk =>
async (dispatch, getState) => {
    const pageData = getState().serviceRequests.urgentPageData;
    dispatch(loadingNonUrgentServiceRequests(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequestShort>>(
            Api.endpoints.ServiceRequests.GetShort, {
                params: {serviceCenterId, podId, ...pageData, priority: IServiceRequestPriority.Default}
            }
        );
        dispatch(loadingNonUrgentServiceRequests(false));
        dispatch(getNonUrgentServiceRequests(result));
        dispatch(pagingNonUrgentServiceRequests(paging));
    } catch (e) {
        dispatch(loadingNonUrgentServiceRequests(false));
        console.log('loadNonUrgentServiceRequests', e)
    }
}

export const getSCRequestsShort = createAction<IAssignedServiceRequestShort[]>("ServiceRequestsScreen/GetSCShort");
export const loadSCRequestsShort = (serviceCenterId: number, pricingDisplayType?: EPricingDisplayType): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequestShort>>(
        Api.endpoints.ServiceRequests.GetShort,
        {params: {serviceCenterId, pageSize: 0, pricingDisplayType}}
    );
    dispatch(getSCRequestsShort(result));
}

export const getUpsellServiceRequests = createAction<IUpsellServiceRequest[]>("ServiceRequestsScreen/GetIntervalUpsell");
export const setUpsellLoading = createAction<boolean>("ServiceRequestsScreen/SetUpsellLoading");
export const setUpsellPaging = createAction<IPagingResponse>("ServiceRequestsScreen/SetUpsellPaging");
export const setUpsellPageData = createAction<Partial<IPageRequest>>("ServiceRequestsScreen/SetUpsellPageData");
export const setUpsellFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequestsScreen/SetUpsellFilter");
export const setUpsellOrdering = createAction<IOrder<IUpsellServiceRequest>>("ServiceRequestsScreen/SetUpsellOrder");

export const loadUpsellServiceRequests = (serviceCenterId: number): AppThunk =>
    async (dispatch, getState) => {
        const {upsellPageData, upsellFilter, upsellOrdering} = getState().serviceRequests;
        dispatch(setUpsellLoading(true));
        const data = {...upsellPageData, ...upsellFilter, ...upsellOrdering, serviceCenterId};

        try {
            const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IUpsellServiceRequest>>(
                Api.endpoints.IntervalUpsell.GetUpsellByQuery, {data});
            dispatch(getUpsellServiceRequests(result));
            dispatch(setUpsellLoading(false));
            dispatch(setUpsellPaging(paging));
        } catch (e) {
            dispatch(setUpsellLoading(false));
            console.log('loadUpsellServiceRequests', e)
        }
    }

export const updateUpsellServiceRequest = (
    data: IUpsellServiceRequestUpdate, id: number, serviceCenterId: number, onError: (err: string) => void, onSuccess: () => void
): AppThunk => dispatch => {
    Api.call(Api.endpoints.IntervalUpsell.EditUpsell, {data, urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(loadUpsellServiceRequests(serviceCenterId));
                onSuccess();
            }
        })
        .catch(err => onError(err))
}

export const addUpsellServiceRequests = (
    serviceRequestIds: number[],
    serviceCenterId: number,
    onError: TArgCallback<string>,
    onSuccess: TArgCallback<number[]>,
): AppThunk => dispatch => {
    Api.call(
        Api.endpoints.IntervalUpsell.AddUpsell, {data: {serviceRequestIds, serviceCenterId}}
    )
        .then(result => {
            if (result) {
                dispatch(loadUpsellServiceRequests(serviceCenterId));
                onSuccess(serviceRequestIds);
            }
        })
        .catch(err => {
            onError(err)
        })
}