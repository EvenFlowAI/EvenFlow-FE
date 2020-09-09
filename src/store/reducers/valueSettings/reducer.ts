import {createReducer} from "@reduxjs/toolkit";
import {getCustomerLifetimes, getNewLostCustomers} from "./actions";
import {ICustomerLifetime, INewLostCustomer} from "./types";

type TState = {
    customerLifetimes?: ICustomerLifetime,
    newLostCustomer: INewLostCustomer[]
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
);