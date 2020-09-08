import {createAction} from "@reduxjs/toolkit";
import {ICustomerLifetime, ICustomerLifetimeForm} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getCustomerLifetimes = createAction<ICustomerLifetime>("Value/SetLifetime");
export const loadCustomerLifetimes = (serviceCenterId: number): AppThunk => async dispatch => {
    // TODO: Fix after get response changes
    // const {data} = await Api.call(
    //     Api.endpoints.ValueSettings.GetCL, {params: {serviceCenterId}}
    // );
    // dispatch(getCustomerLifetimes(data as ICustomerLifetime));
}
export const setCustomerLifetimes = (data: ICustomerLifetimeForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ValueSettings.SetCL, {data})
    dispatch(loadCustomerLifetimes(data.serviceCenterId));
}
