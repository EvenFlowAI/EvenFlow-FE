import {createAction} from "@reduxjs/toolkit";
import {TPodNotifications, TSCNotifications} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setLoading = createAction<boolean>('Notifications/SetLoading');
export const setSCNotifications = createAction<TSCNotifications>('Notifications/SetSCNotifications');
export const setPodNotifications = createAction<TPodNotifications>('Notifications/SetPodNotifications');
export const setRecallNotifications = createAction<TSCNotifications>('Notifications/SetRecallNotifications');

export const loadNotifications = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.GetAll, {urlParams: {id}})
        .then(result => {
            console.log(result)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updatePodNotifications = (id: number, data: TPodNotifications): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.UpdateForPod, {urlParams: {id}, data})
        .then(result => {
            console.log(result)
            if (result) dispatch(loadNotifications(id))
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateNotificationsByType = (id: number, data: TSCNotifications): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Notifications.UpdateByType, {urlParams: {id}, data})
        .then(result => {
            console.log(result)
            if (result) dispatch(loadNotifications(id))
        })
        .finally(() => dispatch(setLoading(false)))
}