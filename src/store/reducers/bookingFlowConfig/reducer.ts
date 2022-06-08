import {EServiceTypeBookingFlow, TServiceTypeSettings} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {setBookingFlowConfig, setBookingFlowConfigLoading} from "./actions";

export const initialData: TServiceTypeSettings[] = [
    {
        available: true,
        valueService: true,
        productPageForValueService: true,
        advisorSelection: true,
        serviceType: EServiceTypeBookingFlow.VisitCenter
    },
    {
        available: false,
        valueService: true,
        productPageForValueService: true,
        advisorSelection: false,
        serviceType: EServiceTypeBookingFlow.MobileService
    },
    {
        available: false,
        valueService: true,
        productPageForValueService: true,
        advisorSelection: true,
        serviceType: EServiceTypeBookingFlow.PickUpDropOff
    },
]

interface InitialState {
    config: TServiceTypeSettings[],
    isLoading: boolean;
}

const initialState: InitialState = {
    config: initialData,
    isLoading: false,
}

export const bookingFlowConfigReducer = createReducer(initialState, builder => builder
    .addCase(setBookingFlowConfig, (state, {payload}) => {
        return {...state, config: payload?.length ? payload : initialData};
    })
    .addCase(setBookingFlowConfigLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
)