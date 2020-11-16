import {createAction} from "@reduxjs/toolkit";
import {IPricingLevel} from "./types";
import {Api} from "../../../config/requests";
import {AppThunk} from "../../../types/types";

export const getPricingLevels = createAction<IPricingLevel[]>("PricingSettings");
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
