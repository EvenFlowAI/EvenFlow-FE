import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IEndUserConfig} from "../../../features/admin/Reporting/types";

export const getConfig  = createAction<IEndUserConfig>('Reporting/GetConfig');
export const setLoading  = createAction<boolean>('Reporting/SetLoading');

export const loadToken = (id: number): AppThunk => (dispatch, getState) => {
    const {config} = getState().reporting;
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Qrvey.GetToken, {data: {serviceCenterId: id}})
        .then(result => {
            dispatch(getConfig({...config, qv_token: result?.data?.token ?? ''}))
        })
        .catch(err => {
            console.log('get qrvey token error', err)
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
}