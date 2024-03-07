import {createReducer} from "@reduxjs/toolkit";
import {TState} from "./types";
import {getEmailRequirement, setEmailRequirementLoading, setConsentsList, setConsentLoading} from "./actions";

const initialState: TState = {
    emailRequirement: null,
    isEmailRequirementLoading: false,
    consentsList: [],
    isConsentLoading: false,
}
export const screenSettingsReducer = createReducer(initialState, builder => builder
    .addCase(getEmailRequirement, (state, {payload}) => {
        return {...state, emailRequirement: payload}
    })
    .addCase(setEmailRequirementLoading, (state, {payload}) => {
        return {...state, isEmailRequirementLoading: payload}
    })
    .addCase(setConsentLoading, (state, {payload}) => {
        return {...state, isConsentLoading: payload};
    })
    .addCase(setConsentsList, (state, { payload }) => {
        return {...state, consentsList: payload};
    })
);