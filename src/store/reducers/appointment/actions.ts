import {createAction} from "@reduxjs/toolkit";
import {IServiceCenterProfile, ISR, TS1Form} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getServiceCenterProfile = createAction<IServiceCenterProfile>("Appointment/GetSCProfile");
export const loadSCProfile = (id: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IServiceCenterProfile>(
        Api.endpoints.ServiceCenters.Retrieve,
        {urlParams: {id}}
    )
    dispatch(getServiceCenterProfile(data));
}
export const getSRs = createAction<ISR[]>("Appointment/GetSRs");
export const loadSRs = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<ISR>>(
        Api.endpoints.ServiceRequests.GetShort,
        {params: {serviceCenterId, pageSize: 0}}
    );
    dispatch(getSRs(result));
}
export const selectSR = createAction<number|null>("Appointment/SelectSR");
export const changeS1Form = createAction<Partial<TS1Form>>("Appointment/ChangeS1Form");