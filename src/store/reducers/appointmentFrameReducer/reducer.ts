import {TServiceCard} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {selectService, selectSubService} from "./actions";

type TState = {
    service: TServiceCard|null;
    subService: TServiceCard|null;
}
const initialState: TState = {
    service: null,
    subService: null,
};

export const appointmentFrameReducer = createReducer(initialState, builder => builder
    .addCase(selectService, (state, {payload}) => {
        return {...state, service: payload, subService: null};
    })
    .addCase(selectSubService, (state, {payload}) => {
        return {...state, service: payload};
    })
)