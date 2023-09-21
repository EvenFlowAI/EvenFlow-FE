import {createAction} from "@reduxjs/toolkit";

export const setLoading = createAction<boolean>('Notifications/SetLoading');
export const setSCNotifications = createAction<boolean>('Notifications/SetSCNotifications');
export const setPodNotifications = createAction<boolean>('Notifications/SetPodNotifications');
export const setRecallNotifications = createAction<boolean>('Notifications/SetRecallNotifications');