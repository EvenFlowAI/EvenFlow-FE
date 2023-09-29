import {createAction} from "@reduxjs/toolkit";
import {TPodNotifications, TSCNotifications} from "./types";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setLoading = createAction<boolean>('Notifications/SetLoading');
export const setSCNotifications = createAction<TSCNotifications>('Notifications/SetSCNotifications');
export const setPodNotifications = createAction<TPodNotifications[]>('Notifications/SetPodNotifications');
export const setRecallNotifications = createAction<TSCNotifications>('Notifications/SetRecallNotifications');

export const loadNotifications = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.GetAll, {urlParams: {id}})
        .then(result => {
            if (result?.data) {
                const {pods, serviceCenter, recalls} = result.data;
                dispatch(setPodNotifications(pods))
                dispatch(setRecallNotifications(recalls))
                dispatch(setSCNotifications(serviceCenter))
            }
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updatePodNotifications = (id: number, data: TPodNotifications[], onSuccess: TCallback, onError: TArgCallback<{err: string}>): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.UpdateForPod, {urlParams: {id}, data: {serviceCenterId: id, podEmployees: data}})
        .then(result => {
            if (result) dispatch(loadNotifications(id))
            onSuccess()
        })
        .catch(err => onError(err))
        .finally(() => dispatch(setLoading(false)))
}

export const updateNotificationsByType = (id: number, data: TSCNotifications, onSuccess: TCallback, onError: TArgCallback<{err: string}>): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.UpdateByType, {urlParams: {id}, data: {serviceCenterId: id, ...data}})
        .then(result => {
            if (result) dispatch(loadNotifications(id))
            onSuccess()
        })
        .catch(err => onError(err))
        .finally(() => dispatch(setLoading(false)))
}