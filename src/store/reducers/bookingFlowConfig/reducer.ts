import {IBookingFlowConfig} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {setBookingFlowConfig, setBookingFlowConfigLoading} from "./actions";

const initialData: IBookingFlowConfig = {
    visitCenter: {
        available: true,
        valueService: false,
        productPageForValueService: false,
        advisorSelection: true,
    },
    mobileService: {
        available: false,
        valueService: false,
        productPageForValueService: false,
        advisorSelection: false,
    },
    pickUpDropOff: {
        available: false,
        valueService: false,
        productPageForValueService: false,
        advisorSelection: false,
    }
}

interface InitialState {
    config: IBookingFlowConfig,
    isLoading: boolean;
}

const initialState: InitialState = {
    config: initialData,
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