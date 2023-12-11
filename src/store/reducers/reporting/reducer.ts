import {createReducer} from "@reduxjs/toolkit";
import {IEndUserConfig} from "../../../QrveyEndUser/types";
import {getConfig, setLoading} from "./actions";

type TState = {
    config: IEndUserConfig;
    isLoading: boolean;
}
const initialState: TState = {
    config: {
        domain: 'https://pcuxl.qrveyapp.com',
    },
    isLoading: false,
}

export const reportingReducer = createReducer(initialState, builder => builder
    .addCase(getConfig, (state, {payload}) => {
        return {...state, config: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
)