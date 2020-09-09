import {createAction} from "@reduxjs/toolkit";
import {ICustomerLifetime, ICustomerLifetimeForm, INewLostCustomer} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getCustomerLifetimes = createAction<ICustomerLifetime|undefined>("Value/SetLifetime");
export const getNewLostCustomers = createAction<INewLostCustomer[]>("Value/NewLostCustomer");
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

export const loadNewLostCustomers = (serviceCenterId: number): AppThunk => async dispatch => {
    try {
        const {data} = await Api.call<INewLostCustomer[]>(
            Api.endpoints.ValueSettings.GetCTS, {params: {serviceCenterId}}
        );
        dispatch(getNewLostCustomers(data));
    } catch (e) {
        if (e?.response?.status === 400) {
            dispatch(getNewLostCustomers([]));
        } else {
            throw e;
        }
    }
}
export const setNewLostCustomers = (data: INewLostCustomer): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ValueSettings.SetCTS, {data});
    dispatch(loadNewLostCustomers(data.serviceCenterId));
}
