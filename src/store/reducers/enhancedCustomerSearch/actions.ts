import {createAction} from "@reduxjs/toolkit";
import {ICustomerWithPhones, ICustomerWithVehicles, IRepairHistory, TSearchCustomerParams} from "./types";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {ActionCreator} from "redux";

export const getCustomers = createAction<ICustomerWithPhones[]>("CustomerSearch/GetCustomers");
export const getSingleCustomerVehicles = createAction<ICustomerWithVehicles|null>("CustomerSearch/GetSingleCustomerVehicles");
export const setCurrentCustomer = createAction<ICustomerWithPhones|null>("CustomerSearch/SetCurrentCustomer");
export const setLoading = createAction<boolean>("CustomerSearch/SetLoading");

export const setPaging = createAction<IPagingResponse>("CustomerSearch/SetPaging");
export const setPageData = createAction<Partial<IPageRequest>>("CustomerSearch/SetPageData");
export const getRepairHistory = createAction<IRepairHistory|null>("CustomerSearch/GetRepairHistory");
export const setRepairHistoryLoading = createAction<boolean>("CustomerSearch/SetRepairHistoryLoading");
export const setRepairHistoryPaging = createAction<IPagingResponse>("CustomerSearch/SetRepairHistoryPaging");

// export const loadCustomersByName = (
//     serviceCenterId: number,
//     onSuccess: (count: number) => void,
//     onError: (err: string) => void,
//     firstName?: string,
//     lastName?: string,
// ): AppThunk => (dispatch, getState) => {
//     dispatch(setLoading(true))
//     const {pageSize, pageIndex} = getState().customers.pageData;
//     Api.call<PaginatedAPIResponse<ICustomerByName>>(Api.endpoints.Customers.GetByName, {params: {serviceCenterId, firstName, lastName, pageSize, pageIndex}})
//         .then(result => {
//             if (result.data?.result) {
//                 dispatch(getCustomers(result.data.result))
//                 dispatch(setPaging(result.data.paging))
//                 onSuccess(result.data.result.length)
//             }
//         })
//         .catch(err => {
//             console.log('get customers by name error', err)
//             onError(err)
//         })
//         .finally(() => dispatch(setLoading(false)))
// }

export const loadCustomersBySearchTerm = (
    serviceCenterId: number,
    onSuccess: (count: number) => void,
    onError: (err: string) => void,
    firstName?: string,
    lastName?: string,
    phoneOrEmail?: string,
): AppThunk => (dispatch, getState) => {
    const {pageSize, pageIndex} = getState().customers.pageData;
    const data: TSearchCustomerParams = {};
    if (phoneOrEmail) data.phoneOrEmail = phoneOrEmail;
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;

    if (Object.keys(data).length) {
        Api.call<PaginatedAPIResponse<ICustomerWithPhones>>(Api.endpoints.Customers.GetBySearchTerm,
            {params: {serviceCenterId, ...data, pageSize, pageIndex}})
            .then(result => {
                if (result.data?.result) {
                    dispatch(getCustomers(result.data.result))
                    dispatch(setPaging(result.data.paging))
                    onSuccess(result.data.result.length)
                }
            })
            .catch(err => {
                console.log('get customers by search term error', err)
                onError(err)
            })
            .finally(() => dispatch(setLoading(false)))
    } else {
        onError("Please enter phone, email, first name or last name")
    }
}

export const loadCustomersByPhoneOrEmail = (
    serviceCenterId: number,
    onError: (err: string) => void,
    phoneOrEmail: string,
): AppThunk => (dispatch) => {
    Api.call(Api.endpoints.Customers.GetSingleCustomerVehicles,
        {params: {serviceCenterId, phoneOrEmail}})
        .then(result => {
            if (result.data?.result) {
                dispatch(getSingleCustomerVehicles(result.data.result))
            }
        })
        .catch(err => {
            console.log('get customers by search term error', err)
            onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const changePageData: ActionCreator<AppThunk> = (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(setPageData(payload));
    }
}

export const updateCustomer = (data: ICustomerWithPhones, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Customers.Update, {data})
        .then(res => {
            if (res) onSuccess();
        })
        .catch(err => {
            onError(err);
            console.log('update customer err', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadRepairHistory = (serviceCenterId: number, vehicleDmsId: string, pageIndex: number, pageSize: number): AppThunk => dispatch => {
    dispatch(setRepairHistoryLoading(true));
    Api.call(Api.endpoints.Customers.GetRepairHistory, {params: {serviceCenterId, vehicleDmsId, pageIndex, pageSize}})
        .then(result => {
            if (result?.data?.result) {
                dispatch(getRepairHistory(result.data.result))
                dispatch(setRepairHistoryPaging(result.data.paging))
            }
        })
        .catch(err => {
            console.log('get repair history error', err)
        })
        .finally(() => dispatch(setRepairHistoryLoading(false)))
}

export const loadMoreRepairHistory = (serviceCenterId: number, vehicleDmsId: string, pageIndex: number, pageSize: number): AppThunk => (dispatch, getState) => {
    dispatch(setRepairHistoryLoading(true));
    const {repairHistory} = getState().customers;
    Api.call(Api.endpoints.Customers.GetRepairHistory, {params: {serviceCenterId, vehicleDmsId, pageIndex, pageSize}})
        .then(result => {
            if (result?.data?.result?.repairOrders && repairHistory) {
                const data = {...repairHistory, repairOrders: [...repairHistory?.repairOrders, ...result.data.result.repairOrders]}
                dispatch(getRepairHistory(data))
                dispatch(setRepairHistoryPaging(result.data.paging))
            }
        })
        .catch(err => {
            console.log('get repair history error', err)
        })
        .finally(() => dispatch(setRepairHistoryLoading(false)))
}