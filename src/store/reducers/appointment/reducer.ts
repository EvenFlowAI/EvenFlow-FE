import {createReducer} from "@reduxjs/toolkit";
import {IServiceCenterProfile, ISR, TS1Form, TS3Form} from "./types";
import {changeS1Form, changeS3Form, getServiceCenterProfile, getSRs, handleSearch, selectSR} from "./actions";

type TState = {
    scProfile?: IServiceCenterProfile;
    serviceRequests: ISR[];
    selectedSR: number|null,
    s1Data: TS1Form;
    search: string;
    s3Data: TS3Form;
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
const initialS3Form: TS3Form = {
    appointmentType: 1
}
const initialState: TState = {
    serviceRequests: [],
    selectedSR: null,
    s1Data: initialS1Form,
    search: "",
    s3Data: initialS3Form
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
    .addCase(changeS3Form, (state, {payload}) => {
        return {...state, s3Data: {...state.s3Data, ...payload, date: payload.date || undefined}};
    })
);