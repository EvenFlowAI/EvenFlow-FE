import {createReducer} from "@reduxjs/toolkit";
import {
    selectService,
    selectSubService,
    setAdvisor,
    setFrameDescription,
    setPackage,
    setTime,
    setTiming
} from "./actions";
import {IServiceCategory, IServiceConsultant} from "../../../api/types";
import {ETiming} from "./types";
import moment from "moment";

type TState = {
    service: IServiceCategory|null;
    subService: IServiceCategory|null;
    description: string;
    selectedPackage: number|null;
    advisor: IServiceConsultant|null;
    selectedTiming: ETiming|null;
    selectedTime: moment.Moment|null;
}
const initialState: TState = {
    service: null,
    subService: null,
    selectedPackage: null,
    description: "",
    advisor: null,
    selectedTime: null,
    selectedTiming: null
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
    .addCase(setAdvisor, (state, {payload}) => {
        return {...state, advisor: payload};
    })
    .addCase(setTiming, (state, {payload}) => {
        return {
            ...state,
            selectedTiming: payload,
            selectedTime: payload !== ETiming.SelectDate ? null : state.selectedTime
        };
    })
    .addCase(setTime, (state, {payload}) => {
        return {...state, selectedTime: payload};
    })
)