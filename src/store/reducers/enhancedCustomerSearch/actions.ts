import {createAction} from "@reduxjs/toolkit";
import {ICustomerByName} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {ICustomerWithVehicles} from "../customer/types";

export const getCustomers = createAction<ICustomerWithVehicles[]>("CustomerSearch/GetCustomers");
export const setCurrentCustomer = createAction<ICustomerByName|null>("CustomerSearch/SetCurrentCustomer");
export const setLoading = createAction<boolean>("CustomerSearch/SetLoading");

export const loadCustomersByName = (
    serviceCenterId: number,
    firstName: string,
    lastName: string,
    onSuccess: (count: number) => void,
    onError: (err: string) => void,
    ): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Customers.GetByName, {params: {serviceCenterId, firstName, lastName}})
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