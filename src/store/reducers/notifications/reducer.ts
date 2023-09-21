import {createReducer} from "@reduxjs/toolkit";
import {
    setLoading,
} from "./actions";

type TState = {
    isLoading: boolean;
}

const initialState: TState = {
    isLoading: false,
}

export const notificationsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
)