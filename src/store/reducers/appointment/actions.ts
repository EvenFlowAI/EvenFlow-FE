import {createAction} from "@reduxjs/toolkit";
import {IServiceCenterProfile} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getServiceCenterProfile = createAction<IServiceCenterProfile>("Appointment/GetSCProfile");
export const loadSCProfile = (id: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IServiceCenterProfile>(
        Api.endpoints.ServiceCenters.Retrieve,
        {urlParams: {id}}
    )
    dispatch(getServiceCenterProfile(data));
}