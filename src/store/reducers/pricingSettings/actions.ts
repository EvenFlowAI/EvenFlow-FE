import {createAction} from "@reduxjs/toolkit";
import {IPricingLevel, ITimeWindowEl} from "./types";
import {Api} from "../../../config/requests";
import {AppThunk} from "../../../types/types";

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
    dispatch(loadTimeWindows(data.serviceCenterId));
}
