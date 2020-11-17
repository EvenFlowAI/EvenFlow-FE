import {createAction} from "@reduxjs/toolkit";
import {IPricingLevel, ITimeWindowEl} from "./types";
import {Api} from "../../../config/requests";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {IAssignedServiceRequest} from "../serviceRequests/types";

export const getPricingLevels = createAction<IPricingLevel[]>("PricingSettings/GetPL");
export const loadPricingLevels = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IPricingLevel[]>(
        Api.endpoints.PricingSettings.GetLevels,
        {params: {serviceCenterId}}
    );
    dispatch(getPricingLevels(data));
}
export const setPricingLevels = (data: IPricingLevel): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.PricingSettings.SetLevels, {data});
    dispatch(loadPricingLevels(data.serviceCenterId));
}

export const getTimeWindows = createAction<ITimeWindowEl[]>("PricingSettings/GetTimeWindows");
export const loadTimeWindows = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<ITimeWindowEl[]>(
        Api.endpoints.AppointmentAllocation.GetTWEligibility,
        {params: {serviceCenterId}}
    );
    dispatch(getTimeWindows(data));
}
export const setTimeWindows = (data: ITimeWindowEl): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.AppointmentAllocation.SetTWEligibility, {data}
    );
    await dispatch(loadTimeWindows(data.serviceCenterId));
}
export const getSrList = createAction<IAssignedServiceRequest[]>("PricingSettings/GetSRList");
export const loadSrList = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequest>>(
        Api.endpoints.ServiceRequests.GetAssignedOverrides,
        {params: {pageSize: 0, serviceCenterId}}
    );
    dispatch(getSrList(result));
}
export const setEligibleRequest = (id: number, isEligibility: boolean, serviceCenterId?: number): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.ServiceRequests.Eligibility,
        {data: {id, isEligibility}}
    );
    if (serviceCenterId) {
        await dispatch(loadSrList(serviceCenterId));
    }
}
