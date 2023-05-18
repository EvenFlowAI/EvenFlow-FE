import {createAction} from "@reduxjs/toolkit";
import {ICustomerByName} from "./types";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {ActionCreator} from "redux";

export const getCustomers = createAction<ICustomerByName[]>("CustomerSearch/GetCustomers");
export const setCurrentCustomer = createAction<ICustomerByName|null>("CustomerSearch/SetCurrentCustomer");
export const setLoading = createAction<boolean>("CustomerSearch/SetLoading");
export const setPaging = createAction<IPagingResponse>("CustomerSearch/SetPaging");
export const setPageData = createAction<Partial<IPageRequest>>("CustomerSearch/SetPageData");

export const loadCustomersByName = (
    serviceCenterId: number,
    firstName: string,
    lastName: string,
    onSuccess: (count: number) => void,
    onError: (err: string) => void,
): AppThunk => (dispatch, getState) => {
    dispatch(setLoading(true))
    const {pageSize, pageIndex} = getState().customers.pageData;
    Api.call<PaginatedAPIResponse<ICustomerByName>>(Api.endpoints.Customers.GetByName, {params: {serviceCenterId, firstName, lastName, pageSize, pageIndex}})
        .then(result => {
            if (result.data?.result) {
                dispatch(getCustomers(result.data.result))
                dispatch(setPaging(result.data.paging))
                onSuccess(result.data.result.length)
            }
        })
        .catch(err => {
            console.log('get customers by name error', err)
            onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
}
export const changePageData: ActionCreator<AppThunk> = (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(setPageData(payload));
    }
}

export const updateCustomer = (data: ICustomerByName, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
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