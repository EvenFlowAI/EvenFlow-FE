import {createReducer} from "@reduxjs/toolkit";
import {selectService, selectSubService, setFrameDescription, setPackage} from "./actions";
import {IServiceCategory} from "../../../api/types";

type TState = {
    service: IServiceCategory|null;
    subService: IServiceCategory|null;
    description: string;
    selectedPackage: number|null;
}
const initialState: TState = {
    service: null,
    subService: null,
    selectedPackage: null,
    description: ""
};

export const appointmentFrameReducer = createReducer(initialState, builder => builder
    .addCase(selectService, (state, {payload}) => {
        return {...state, service: payload, subService: null};
    })
    .addCase(selectSubService, (state, {payload}) => {
        return {...state, subService: payload};
    })
    .addCase(setFrameDescription, (state, {payload}) => {
        return {...state, description: payload};
    })
    .addCase(setPackage, (state, {payload}) => {
        return {...state, selectedPackage: payload};
    })
)