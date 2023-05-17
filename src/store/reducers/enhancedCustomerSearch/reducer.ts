import {createReducer} from "@reduxjs/toolkit";
import {ICustomerByName} from "./types";
import {getCustomers, setCurrentCustomer, setLoading} from "./actions";

type TCustomerSearchState = {
    isLoading: boolean;
    customers: ICustomerByName[];
    currentCustomer: ICustomerByName|null;
}
const initialState: TCustomerSearchState = {
    isLoading: false,
    customers: [],
    currentCustomer: null,
}

export const customerReducer = createReducer(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(getCustomers, (state, {payload}) => {
        return {...state, customers: payload}
    })
    .addCase(setCurrentCustomer, (state, {payload}) => {
        return {...state, currentCustomer: payload}
    })
)