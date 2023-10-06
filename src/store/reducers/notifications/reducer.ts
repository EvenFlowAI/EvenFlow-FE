import {createReducer} from "@reduxjs/toolkit";
import {
    setLoading, setPodNotifications, setRecallNotifications, setSCNotifications, setTransportationNotifications,
} from "./actions";
import {TPodNotifications, TSCNotifications, TTransportationNotifications} from "./types";

type TState = {
    isLoading: boolean;
    scNotifications: TSCNotifications|null;
    podNotifications: TPodNotifications[];
    transportationNotifications: TTransportationNotifications[];
    recallNotifications: TSCNotifications|null;
}

const initialState: TState = {
    isLoading: false,
    scNotifications: null,
    podNotifications: [],
    transportationNotifications: [],
    recallNotifications: null,
}

export const notificationsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(setSCNotifications, (state, {payload}) => {
        return {...state, scNotifications: payload}
    })
    .addCase(setPodNotifications, (state, {payload}) => {
        return {...state, podNotifications: payload}
    })
    .addCase(setTransportationNotifications, (state, {payload}) => {
        return {...state, transportationNotifications: payload}
    })
    .addCase(setRecallNotifications, (state, {payload}) => {
        return {...state, recallNotifications: payload}
    })
)