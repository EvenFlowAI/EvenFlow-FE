import {createAction} from "@reduxjs/toolkit";
import {ICustomerLifetime, ICustomerLifetimeForm} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getCustomerLifetimes = createAction<ICustomerLifetime|undefined>("Value/SetLifetime");
export const loadCustomerLifetimes = (serviceCenterId: number): AppThunk => async dispatch => {
    try {
        const {data} = await Api.call<ICustomerLifetime>(
            Api.endpoints.ValueSettings.GetCL, {params: {serviceCenterId}}
        );
        dispatch(getCustomerLifetimes(data));
    } catch (e) {
        if (e?.response?.status === 400) {
            dispatch(getCustomerLifetimes(undefined));
        } else {
            throw e;
        }
    }
}
export const setCustomerLifetimes = (data: ICustomerLifetimeForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ValueSettings.SetCL, {data})
    dispatch(loadCustomerLifetimes(data.serviceCenterId));
}
