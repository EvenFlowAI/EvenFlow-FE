import {createAction} from "@reduxjs/toolkit";
import {ICustomerByName} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getCustomers = createAction<ICustomerByName[]>("CustomerSearch/GetCustomers");
export const setCurrentCustomer = createAction<ICustomerByName|null>("CustomerSearch/SetCurrentCustomer");
export const setLoading = createAction<boolean>("CustomerSearch/SetLoading");

export const loadCustomersByName = (
    serviceCenterId: number,
    firstName: string,
    lastName: string,
    onSuccess: (count: number) => void,
    onError: (err: string) => void,
    pageSize = 10,
    pageIndex = 0,
    ): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Customers.GetByName, {params: {serviceCenterId, firstName, lastName, pageSize, pageIndex}})
        .then(result => {
            if (result.data?.result) {
                dispatch(getCustomers(result.data.result))
                onSuccess(result.data.result.length)
            }
        })
        .catch(err => {
            console.log('get customers by name error', err)
            onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
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