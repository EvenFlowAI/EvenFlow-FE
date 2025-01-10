import { createReducer } from "@reduxjs/toolkit";
import { TState } from "./types";
import {
  getEmailRequirement,
  setEmailRequirementLoading,
  setConsentsList,
  setConsentLoading,
  setLoading,
  getCurrentConsent,
} from "./actions";

const initialState: TState = {
  emailRequirement: null,
  isEmailRequirementLoading: false,
  consentsList: [],
  isConsentLoading: false,
  isLoading: false,
  currentConsent: null,
};
export const screenSettingsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(getEmailRequirement, (state, { payload }) => {
      return { ...state, emailRequirement: payload };
    })
    .addCase(setEmailRequirementLoading, (state, { payload }) => {
      return { ...state, isEmailRequirementLoading: payload };
    })
    .addCase(setConsentLoading, (state, { payload }) => {
      return { ...state, isConsentLoading: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setConsentsList, (state, { payload }) => {
      return { ...state, consentsList: payload };
    })
    .addCase(getCurrentConsent, (state, { payload }) => {
      return { ...state, currentConsent: payload };
    }),
);
