import {createReducer} from "@reduxjs/toolkit";
import {getCustomerLifetimes} from "./actions";
import {ICustomerLifetime} from "./types";

type TState = {
    customerLifetimes?: ICustomerLifetime
}
const initialState: TState = {

}
export const valueSettingsReducer = createReducer<TState>(
    initialState, builder => builder
        .addCase(getCustomerLifetimes, (state, {payload}) => {
            return {...state, customerLifetimes: payload};
        })
);