import {TServiceCard} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {selectService} from "./actions";

type TState = {
    service: TServiceCard|null
}
const initialState: TState = {
    service: null
};

export const appointmentFrameReducer = createReducer(initialState, builder => builder
    .addCase(selectService, (state, {payload}) => {
        return {...state, service: payload};
    })
)