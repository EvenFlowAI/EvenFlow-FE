import {createReducer} from "@reduxjs/toolkit";
import {IServiceCenterProfile, ISR, TS1Form} from "./types";
import {changeS1Form, getServiceCenterProfile, getSRs, selectSR} from "./actions";

type TState = {
    scProfile?: IServiceCenterProfile;
    serviceRequests: ISR[];
    selectedSR: number|null,
    s1Data: TS1Form;
}
const initialS1Form: TS1Form = {
    year: null,
    millage: null,
}
const initialState: TState = {
    serviceRequests: [],
    selectedSR: null,
    s1Data: initialS1Form
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
    .addCase(changeS1Form, (state, {payload}) => {
        return {...state, s1Data: {...state.s1Data, ...payload}};
    })
);