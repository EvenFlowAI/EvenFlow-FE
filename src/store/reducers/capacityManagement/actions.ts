import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";

import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {ICapacitySetting} from "./types";

export const setLoading = createAction<boolean>('CapacitySettings/SetLoading');
export const getCapacitySettings = createAction<ICapacitySetting[]>('CapacitySettings/GetCapacitySettings');

export const loadCapacitySettings = (serviceCenterId: number, day: string): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.CapacitySettings.GetCapacitySettings, {params: {serviceCenterId, day}})
        .then(res => {
            if (res.data) dispatch(getCapacitySettings(res.data))
        })
        .catch(err => {
            console.log('load capacity settings err', err)
        })
        .finally(() => dispatch(setLoading(false)))
}
