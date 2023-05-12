import {ICustomerWithVehicles} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getCustomersByName} from "./actions";

type TState = {
    customers: ICustomerWithVehicles[];
    isLoading: boolean;
}

const initialState: TState = {
    customers: [],
    isLoading: false,
}

export const customerReducer = createReducer(initialState, builder => builder
    .addCase(getCustomersByName, (state, {payload}) => {
        return {...state, customers: payload};
    })
)