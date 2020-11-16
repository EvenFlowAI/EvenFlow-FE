import {createReducer} from "@reduxjs/toolkit";
import {IServiceCenterProfile, ISR, TS1Form} from "./types";
import {changeS1Form, getServiceCenterProfile, getSRs, handleSearch, selectSR} from "./actions";

type TState = {
    scProfile?: IServiceCenterProfile;
    serviceRequests: ISR[];
    selectedSR: number|null,
    s1Data: TS1Form;
    search: string;
}
const initialS1Form: TS1Form = {
    year: null,
    vin: "",
    mileage: null,
    driveType: "",
    engineType: "",
    make: "",
    model: "",
    transmission: ""
}
const initialState: TState = {
    serviceRequests: [],
    selectedSR: null,
    s1Data: initialS1Form,
    search: "",
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
    .addCase(handleSearch, (state, {payload}) => {
        return {...state, search: payload};
    })
);