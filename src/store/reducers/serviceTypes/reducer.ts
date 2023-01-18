import {IServiceType} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getServiceTypesByQuery, setServiceTypesLoading} from "./actions";

type TState = {
    serviceTypes: IServiceType[];
    isLoading: boolean;
}

const initialState: TState = {
    serviceTypes: [],
    isLoading: false,
}

export const serviceTypesReducer = createReducer(initialState, builder => builder
    .addCase(setServiceTypesLoading, (state, { payload }) => {
        return {...state, isLoading: payload};
    })
    .addCase(getServiceTypesByQuery, (state, {payload}) => {
        return {...state, serviceTypes: payload};
    })
)