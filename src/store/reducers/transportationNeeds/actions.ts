import {createAction} from "@reduxjs/toolkit";
import {IEditedTransportationOption, ITransportationOptionFull, ITransportationOptionRules} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setTransportationLoading = createAction<boolean>("TransportationNeeds/SetLoading");
export const getTransportationOptions = createAction<ITransportationOptionFull[]>("TransportationNeeds/GetOptions");

export const loadTransportationOptions = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setTransportationLoading(true));
    Api.call(Api.endpoints.TransportationOptions.Get, {params: {serviceCenterId}})
        .then(result => {
            if (result.data) {
                dispatch(getTransportationOptions(result.data))
            }
        })
        .catch(err => {
            console.log('load transportation needs error', err)
        })
        .finally(() => dispatch(setTransportationLoading(false)));
}

export const updateTransportationOption = (data: IEditedTransportationOption): AppThunk => dispatch => {
    Api.call(Api.endpoints.TransportationOptions.Edit, {data})
        .then(result => {
            if (result) {
                dispatch(loadTransportationOptions(data.serviceCenterId))
            }
        })
        .catch(err => {
            console.log('load transportation needs error', err)
        })
}

export const editTransportationOptionRules = (
    optionId: number,
    serviceCenterId: number,
    data: ITransportationOptionRules,
    successCallback = () => {},
    errorCallback = (err: {code: number, errorMessage: string}) => {},
): AppThunk => dispatch => {
    Api.call(Api.endpoints.TransportationOptions.Rules, {urlParams: {id: optionId}, data})
        .then(result => {
            if (result) {
                dispatch(loadTransportationOptions(serviceCenterId))
                successCallback();
            }
        })
        .catch(err => {
            errorCallback(err);
            console.log('edit transportation option rules error', err)
        })
}
