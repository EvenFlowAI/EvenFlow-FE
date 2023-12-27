import {createReducer} from "@reduxjs/toolkit";
import {TState} from "./types";
import {getEmailRequirement, setEmailRequirementLoading} from "./actions";

const initialState: TState = {
    emailRequirement: null,
    isEmailRequirementLoading: false,
}
export const screenSettingsReducer = createReducer(initialState, builder => builder
    .addCase(getEmailRequirement, (state, {payload}) => {
        return {...state, emailRequirement: payload}
    })
    .addCase(setEmailRequirementLoading, (state, {payload}) => {
        return {...state, isEmailRequirementLoading: payload}
    })
);