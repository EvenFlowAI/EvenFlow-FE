import {createReducer} from "@reduxjs/toolkit";
import {getCustomerLifetimes, getNewLostCustomers, getConfiguredValues,
    getEndOfWarranty, getValueSettings} from "./actions";
import {ICustomerLifetime, IEndOfWarranty, INewLostCustomer, IValueSettings} from "./types";

type TState = {
    customerLifetimes?: ICustomerLifetime,
    newLostCustomer: INewLostCustomer[],
    endOfWarranty?: IEndOfWarranty,
    valueSettings: IValueSettings[],
    configuredValues: number[],
}
const initialState: TState = {
    newLostCustomer: [],
    valueSettings: [],
    configuredValues: [],
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
        .addCase(getValueSettings, (state, {payload}) => {
            return {...state, valueSettings: payload};
        })
        .addCase(getConfiguredValues, (state, {payload}) => {
            return {...state, configuredValues: payload};
        })
);