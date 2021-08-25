import {createReducer} from "@reduxjs/toolkit";
import {
    selectService,
    selectSubService,
    setAdvisor, setCustomer,
    setFrameDescription,
    setPackage,
    setTime,
    setTiming, setVehicle
} from "./actions";
import {ICustomer, ILoadedVehicle, IServiceCategory, IServiceConsultant} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType} from "../appointment/types";

type TState = {
    service: IServiceCategory|null;
    subService: IServiceCategory|null;
    description: string;
    selectedPackage: number|null;
    advisor: IServiceConsultant|null;
    selectedTiming: EAppointmentTimingType|null;
    selectedTime: moment.Moment|null;
    selectedVehicle: ILoadedVehicle|null;
    customer: ICustomer|null;
}
const initialState: TState = {
    service: null,
    subService: null,
    selectedPackage: null,
    description: "",
    advisor: null,
    selectedTime: null,
    selectedTiming: null,
    selectedVehicle: null,
    customer: null
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
            selectedTime: payload !== EAppointmentTimingType.PreferredDate ? null : state.selectedTime
        };
    })
    .addCase(setTime, (state, {payload}) => {
        return {...state, selectedTime: payload};
    })
    .addCase(setVehicle, (state, {payload}) => {
        return {...state, selectedVehicle: payload};
    })
    .addCase(setCustomer, (state, {payload}) => {
        return {...state, customer: payload};
    })
)