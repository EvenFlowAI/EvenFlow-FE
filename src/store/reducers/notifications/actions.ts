import {createAction} from "@reduxjs/toolkit";
import {TSCNotifications, TNotifications, TTransportationNotifications} from "./types";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setLoading = createAction<boolean>('Notifications/SetLoading');
export const setSCNotifications = createAction<TSCNotifications>('Notifications/SetSCNotifications');
export const setPodNotifications = createAction<TNotifications[]>('Notifications/SetPodNotifications');
export const setRecallNotifications = createAction<TSCNotifications>('Notifications/SetRecallNotifications');
export const setTransportationNotifications = createAction<TTransportationNotifications|null>('Notifications/SetTransportationNotifications');

export const loadNotifications = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.GetAll, {urlParams: {id}})
        .then(result => {
            if (result?.data) {
                const {pods, serviceCenter, recalls, transportation} = result.data;
                const {transportationOptions, isActive} = transportation;
                dispatch(setPodNotifications(pods))
                dispatch(setRecallNotifications(recalls))
                dispatch(setSCNotifications(serviceCenter))
                const transportationData: TTransportationNotifications = {
                    isActive: Boolean(isActive),
                    transportationOptions: transportationOptions ?? []
                }
                dispatch(setTransportationNotifications(transportationData))
            }
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updatePodNotifications = (id: number, data: TNotifications[], onSuccess: TCallback, onError: TArgCallback<{err: string}>): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.UpdateForPod, {urlParams: {id}, data: {serviceCenterId: id, podEmployees: data}})
        .then(result => {
            if (result) dispatch(loadNotifications(id))
            onSuccess()
        })
        .catch(err => onError(err))
        .finally(() => dispatch(setLoading(false)))
}

export const updateNotificationsByType = (
    id: number,
    data: TSCNotifications,
    onSuccess: TCallback,
    onError: TArgCallback<{err: string}>
): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.UpdateByType, {urlParams: {id}, data: {serviceCenterId: id, ...data}})
        .then(result => {
            if (result) dispatch(loadNotifications(id))
            onSuccess()
        })
        .catch(err => onError(err))
        .finally(() => dispatch(setLoading(false)))
}

export const updateTransportationNotifications = (
    id: number,
    data: TTransportationNotifications,
    onSuccess: TCallback,
    onError: TArgCallback<{err: string}>): AppThunk => dispatch => {
    const {isActive, transportationOptions} = data
    Api.call(Api.endpoints.Notifications.UpdateForTransportation, {
        urlParams: {id},
        // todo change name field
        data: {serviceCenterId: id, transportationEmployees: transportationOptions, isActive}
    })
        .then(result => {
            if (result) dispatch(loadNotifications(id))
            onSuccess()
        })
        .catch(err => onError(err))
        .finally(() => dispatch(setLoading(false)))
}