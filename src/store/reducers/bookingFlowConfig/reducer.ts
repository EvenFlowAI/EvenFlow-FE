import {TServiceTypeSettings} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {setBookingFlowConfig, setBookingFlowConfigLoading} from "./actions";

interface InitialState {
    config: TServiceTypeSettings[],
    isLoading: boolean;
}

const initialState: InitialState = {
    config: [],
    isLoading: false,
}

export const bookingFlowConfigReducer = createReducer(initialState, builder => builder
    .addCase(setBookingFlowConfig, (state, {payload}) => {
        return {...state, config: payload};
    })
    .addCase(setBookingFlowConfigLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
)