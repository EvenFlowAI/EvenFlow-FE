import {createAction} from "@reduxjs/toolkit";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {ESettingType, IGeneralSetting} from "./types";

export const getSettings = createAction<IGeneralSetting[]>("GeneralSettings/GetSettings");
export const setSettingsLoading = createAction<boolean>("GeneralSettings/SetLoading");

export const loadGeneralSettings = (serviceCenterId: number, settingTypes: ESettingType[]): AppThunk => (dispatch) => {
    dispatch(setSettingsLoading(true));
    let params = new URLSearchParams();
    params.append('serviceCenterId', `${serviceCenterId}`);
    settingTypes.forEach(el => params.append('settingTypes', `${el}`))
    Api.call<IGeneralSetting[]>(Api.endpoints.GeneralSettings.Get, {params})
        .then(result => {
            if (result) {
                dispatch(getSettings(result.data))
            }
        })
        .catch(err => {
            console.log('get general settings error', err)
        })
        .finally(() => {
            dispatch(setSettingsLoading(false));
        })
}

export const updateGeneralSettings = (serviceCenterId: number, podId: number|null, data: IGeneralSetting[], onError: TArgCallback<any>, onSuccess: TCallback): AppThunk => dispatch => {
    dispatch(setSettingsLoading(true));
    Api.call<IGeneralSetting[]>(Api.endpoints.GeneralSettings.Update, {data})
        .then(result => {
            if (result) {
                dispatch(loadGeneralSettings(serviceCenterId, data.map(el => el.settingType)))
                onSuccess()
            }
        })
        .catch(err => {
            console.log('get general settings error', err)
            onError(err)
        })
        .finally(() => {
            dispatch(setSettingsLoading(false));
        })
}