import {ITransportationOptionFull} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getTransportationOptions, setTransportationLoading} from "./actions";

type TState = {
    options: ITransportationOptionFull[];
    isLoading: boolean;
}
const initialState: TState = {
    options: [],
    isLoading: false,
};

export const transportationOptionsReducer = createReducer(initialState, builder => builder
    .addCase(getTransportationOptions, (state, {payload}) => {
        return {...state, options: payload};
    })
    .addCase(setTransportationLoading, (state, { payload }) => {
        return {...state, isLoading: payload};
    })
);