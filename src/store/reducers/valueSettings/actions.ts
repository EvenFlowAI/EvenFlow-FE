import {createAction} from "@reduxjs/toolkit";
import {
    ICustomerLifetime,
    ICustomerLifetimeForm,
    IEndOfWarranty,
    INewLostCustomer,
    IValueSettings,
    IValueSettingsResponse
} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getCustomerLifetimes = createAction<ICustomerLifetime|undefined>("Value/SetLifetime");
export const getNewLostCustomers = createAction<INewLostCustomer[]>("Value/NewLostCustomer");
export const getEndOfWarranty = createAction<IEndOfWarranty|undefined>("Value/EndOfWarranty");
export const getValueSettings = createAction<IValueSettings[]>("Value/Settings");
export const getConfiguredValues = createAction<number[]>("Value/ConfiguredValues");
export const loadCustomerLifetimes = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    try {
        const {data} = await Api.call<ICustomerLifetime>(
            Api.endpoints.ValueSettings.GetCL, {params: {serviceCenterId, podId}}
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
    dispatch(loadCustomerLifetimes(data.serviceCenterId, data.podId));
}

export const loadNewLostCustomers = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    try {
        const {data} = await Api.call<INewLostCustomer[]>(
            Api.endpoints.ValueSettings.GetCTS, {params: {serviceCenterId, podId}}
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
    dispatch(loadNewLostCustomers(data.serviceCenterId, data.podId));
}

export const loadEndOfWarranty = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    try {
        const {data} = await Api.call<IEndOfWarranty[]>(
            Api.endpoints.ValueSettings.GetWS, {params: {serviceCenterId, podId}}
        );
        dispatch(getEndOfWarranty(data[0]));
    } catch (e) {
        if (e?.response?.status === 400) {
            dispatch(getEndOfWarranty(undefined));
        } else {
            throw e;
        }
    }
}
export const setEndOfWarranty = (data: IEndOfWarranty): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.ValueSettings.SetWS, {data});
    dispatch(loadEndOfWarranty(data.serviceCenterId, data.podId));
}

export const loadValueSettings = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IValueSettingsResponse>(
        Api.endpoints.ValueSettings.GetValue,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getValueSettings(data.items));
    dispatch(getConfiguredValues(data.leversToConfiguration));
}
export const setValueSettings = (data: IValueSettings): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.ValueSettings.SetValue, {data}
    );
    await dispatch(loadValueSettings(data.serviceCenterId, data.podId));
}
