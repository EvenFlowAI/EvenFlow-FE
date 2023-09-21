import {createAction} from "@reduxjs/toolkit";
import {TPodNotifications, TSCNotifications} from "./types";

export const setLoading = createAction<boolean>('Notifications/SetLoading');
export const setSCNotifications = createAction<TSCNotifications>('Notifications/SetSCNotifications');
export const setPodNotifications = createAction<TPodNotifications>('Notifications/SetPodNotifications');
export const setRecallNotifications = createAction<TSCNotifications>('Notifications/SetRecallNotifications');