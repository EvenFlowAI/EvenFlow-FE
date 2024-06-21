import {createAction} from "@reduxjs/toolkit";
import {AppThunk, TArgCallback} from "../../../types/types";

import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {ICapacitySetting, ICapacitySettingById, ICapacitySettingRequestData} from "./types";
import dayjs from "dayjs";

export const setLoading = createAction<boolean>('CapacitySettings/SetLoading');
export const getCapacitySettings = createAction<ICapacitySetting[]>('CapacitySettings/GetCapacitySettings');
export const setCurrentSetting = createAction<ICapacitySettingById|null>('CapacitySettings/GetCapacitySettingById')

export const loadCapacitySettings = (serviceCenterId: number, day: string, onError?: TArgCallback<any>): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.CapacitySettings.GetAll, {params: {serviceCenterId, day}})
        .then(res => {
            if (res.data) dispatch(getCapacitySettings(res.data))
        })
        .catch(err => {
            console.log('load capacity settings err', err)
            onError && onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadCapacitySettingById = (id: number, serviceBookId: number|undefined): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.CapacitySettings.GetById, {params: {serviceBookId}, urlParams: {id}})
        .then(res => {
            if (res.data) dispatch(setCurrentSetting(res.data))
        })
        .catch(err => {
            console.log('load capacity setting by id err', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateCapacitySettingById = (data: ICapacitySettingRequestData, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.CapacitySettings.Update, {data})
        .then(res => {
            if (res) {
                dispatch(loadCapacitySettings(data.serviceCenterId, dayjs().format("dddd"), onError))
                onSuccess()
            }
        })
        .catch(err => {
            console.log('load capacity setting by id err', err)
            onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

