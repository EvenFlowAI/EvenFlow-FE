import {createReducer} from "@reduxjs/toolkit";
import {
    setLoading, setSCNotifications,
} from "./actions";
import {TPodNotifications, TSCNotifications} from "./types";

type TState = {
    isLoading: boolean;
    scNotifications: TSCNotifications;
    podNotifications: TPodNotifications;
    recallNotifications: TSCNotifications;
}

const initialSCNotifications: TSCNotifications = {
    isActive: false,
    employeeIds: []
}

const podInitialNotifications: TPodNotifications = {
    pod: null,
    employeeIds: []
}

const initialState: TState = {
    isLoading: false,
    scNotifications: initialSCNotifications,
    podNotifications: podInitialNotifications,
    recallNotifications: initialSCNotifications,
}

export const notificationsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(setSCNotifications, (state, {payload}) => {
        return {...state, scNotifications: payload}
    })
)