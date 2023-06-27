import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {TEmailRequirement} from "./types";

export const getEmailRequirement = createAction<TEmailRequirement>("ServiceCenters/getEmailRequirement");
export const setEmailRequirementLoading = createAction<boolean>("ServiceCenters/SetEmailRequirementLoading");

export const loadEmailRequirement = (id: number): AppThunk => dispatch => {
    dispatch(setEmailRequirementLoading(true))
    // todo request
    dispatch(setEmailRequirementLoading(false))
}