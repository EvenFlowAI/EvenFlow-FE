import {createReducer} from "@reduxjs/toolkit";
import {IServiceCenterProfile, ISR} from "./types";
import {getServiceCenterProfile, getSRs, selectSR} from "./actions";

type TState = {
    scProfile?: IServiceCenterProfile;
    serviceRequests: ISR[];
    selectedSR: number|null
}
const initialState: TState = {
    serviceRequests: [],
    selectedSR: null
}
export const appointmentReducer = createReducer(initialState, builder => builder
    .addCase(getServiceCenterProfile, (state, {payload}) => {
        return {...state, scProfile: payload};
    })
    .addCase(getSRs, (state, {payload}) => {
        return {...state, serviceRequests: payload};
    })
    .addCase(selectSR, (state, {payload}) => {
        return {...state, selectedSR: payload};
    })
);