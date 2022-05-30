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
    ISRAdmin,
    ISRAdminFilters,
    ISRAdminForm
} from "./types";
import {AppThunk, IOrder, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {EPricingDisplayType} from "../pricingSettings/types";

export const getNonSelectedServiceRequests = createAction<IServiceRequest[]>("ServiceRequests/getNonSelected");
export const setLoadingNonSelected = createAction<boolean>("ServiceRequests/loadingNonSelected");
export const setNonSelectedPaging = createAction<IPagingResponse>("ServiceRequests/NonSelectedPaging");
export const setNonSelectedOrder = createAction<IOrder<IServiceRequest>>("ServiceRequests/NonSelectedOrder");
export const setNonSelectedPageData = createAction<Partial<IPageRequest>>("ServiceRequests/NonSelectedPageData");
export const setNonSelectedFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequests/NonSelectedFilter");
export const setServiceRequestsPageActiveTab = createAction<string>("ServiceRequests/SetServiceRequestsPageActiveTab");

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
                    serviceCenterFilter: {
                        isAssigned: Boolean(isAssigned),
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

export const assignServiceRequests = (
    serviceRequestIds: number[],
    serviceCenterId: number,
    onError = (err: string) => {},
    onSuccess = (codes: number[]) => {},
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
export const getAssignedServiceRequests = createAction<IAssignedServiceRequest[]>("ServiceRequests/GetAssigned");
export const getAllAssignedServiceRequests = createAction<IAssignedServiceRequest[]>("ServiceRequests/GetAllAssigned");
export const setAssignedLoading = createAction<boolean>("ServiceRequests/SetAssignedLoading");
export const setAssignedPaging = createAction<IPagingResponse>("ServiceRequests/SetAssignedPaging");
export const setAssignedPageData = createAction<Partial<IPageRequest>>("ServiceRequests/SetAssignedPageData");
export const setAssignedFilter = createAction<Partial<IServiceRequestNonAddedFilter>>("ServiceRequests/SetAssignedFilter");
export const setAssignedOrdering = createAction<IOrder<IAssignedServiceRequest>>("ServiceRequests/SetAssignedOrder");
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
        throw e;
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

export const getUrgentServiceRequests = createAction<IAssignedServiceRequestShort[]>("ServiceRequests/getUrgent");
export const loadingUrgentServiceRequests = createAction<boolean>("ServiceRequests/loadingUrgent");
export const pagingUrgentServiceRequests = createAction<IPagingResponse>("ServiceRequests/pagingUrgent");
export const pageDataUrgentServiceRequests = createAction<Partial<IPageRequest>>("ServiceRequests/pageDataUrgent");
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
        throw e;
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

export const getNonUrgentServiceRequests = createAction<IAssignedServiceRequestShort[]>("ServiceRequests/getNonUrgent");
export const loadingNonUrgentServiceRequests = createAction<boolean>("ServiceRequests/loadingNonUrgent");
export const pagingNonUrgentServiceRequests = createAction<IPagingResponse>("ServiceRequests/pagingNonUrgent");
export const pageDataNonUrgentServiceRequests = createAction<Partial<IPageRequest>>("ServiceRequests/pageDataNonUrgent");
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
        throw e;
    }
}

export const getSCRequestsShort = createAction<IAssignedServiceRequestShort[]>("ServiceRequests/GetSCShort");
export const loadSCRequestsShort = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequestShort>>(
        Api.endpoints.ServiceRequests.GetShort,
        {params: {serviceCenterId, pageSize: 0, pricingDisplayType: EPricingDisplayType.Dynamic}}
    );
    dispatch(getSCRequestsShort(result));
}

export const getAdminServiceRequests = createAction<ISRAdmin[]>("ServiceRequests/getAdmin");
export const setLoadingAdmin = createAction<boolean>("ServiceRequests/loadingAdmin");
export const setAdminPaging = createAction<IPagingResponse>("ServiceRequests/AdminPaging");
export const setAdminPageData = createAction<Partial<IPageRequest>>("ServiceRequests/AdminPageData");
export const setAdminFilter = createAction<Partial<ISRAdminFilters>>("ServiceRequests/AdminFilter");
export const loadAdminServiceRequests = (): AppThunk =>
async (dispatch, getState) => {
    const {adminPageData, adminFilters} = getState().serviceRequests;
    dispatch(setLoadingAdmin(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<ISRAdmin>>(
            Api.endpoints.ServiceRequests.GetFiltered,
            {data: {...adminPageData, ...adminFilters}}
        );
        dispatch(setLoadingAdmin(false));
        dispatch(getAdminServiceRequests(result));
        dispatch(setAdminPaging(paging));
    } catch (e) {
        dispatch(setLoadingAdmin(false));
        throw e;
    }
}
export const removeAdminServiceRequest = (el: ISRAdmin): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ServiceRequests.Remove, {urlParams: {id: el.id}});
    dispatch(loadAdminServiceRequests());
}
export const archiveAdminServiceRequest = (el: ISRAdmin): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ServiceRequests.UpdateStatus, {
        urlParams: {id: el.id},
        data: {status: el.status === EServiceStatus.Archived
                ? EServiceStatus.None : EServiceStatus.Archived}
    });
    dispatch(loadAdminServiceRequests());
}
export const createAdminServiceRequest = (data: ISRAdminForm): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.ServiceRequests.Create,
        {data}
    );
    dispatch(loadAdminServiceRequests());
}
export const updateAdminServiceRequest = (data: ISRAdminForm, id: number): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.ServiceRequests.Update,
        {data, urlParams: {id}}
    );
    dispatch(loadAdminServiceRequests());
}