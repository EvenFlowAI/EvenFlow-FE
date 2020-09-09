import {createReducer} from "@reduxjs/toolkit";
import {getCustomerLifetimes, getNewLostCustomers, getEndOfWarranty} from "./actions";
import {ICustomerLifetime, IEndOfWarranty, INewLostCustomer} from "./types";

type TState = {
    customerLifetimes?: ICustomerLifetime,
    newLostCustomer: INewLostCustomer[],
    endOfWarranty?: IEndOfWarranty
}
const initialState: TState = {
    newLostCustomer: []
}
export const valueSettingsReducer = createReducer<TState>(
    initialState, builder => builder
        .addCase(getCustomerLifetimes, (state, {payload}) => {
            return {...state, customerLifetimes: payload};
        })
        .addCase(getNewLostCustomers, (state, {payload}) => {
            return {...state, newLostCustomer: payload};
        })
        .addCase(getEndOfWarranty, (state, {payload}) => {
            return {...state, endOfWarranty: payload};
        })
);