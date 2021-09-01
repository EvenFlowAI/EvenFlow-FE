import {createReducer} from "@reduxjs/toolkit";
import {
    selectService,
    selectSubService,
    setAdvisor, setAppointmentId, setCustomer,
    setFrameDescription, setMaintenanceDetails,
    setPackage, setReminders,
    setTime,
    setTiming, setTransportation, setVehicle
} from "./actions";
import {
    ICustomer,
    ILoadedVehicle,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType} from "../appointment/types";
import {TMaintenanceDetails} from "./types";

type TState = {
    service: IServiceCategory|null;
    id?: number;
    hashKey?: string;
    subService: IServiceCategory|null;
    description: string;
    selectedPackage: IPackageOptions|null;
    advisor: IServiceConsultant|null;
    selectedTiming: EAppointmentTimingType|null;
    selectedTime: moment.Moment|null;
    selectedVehicle: ILoadedVehicle|null;
    customer: ICustomer;
    reminders: EReminderType[];
    transportation: ITransportation|null;
    maintenanceDetails: TMaintenanceDetails;
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
    customer: {
        fullName: "",
        phoneNumber: "",
        email: ""
    },
    reminders: [],
    transportation: null,
    maintenanceDetails: {}
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
    .addCase(setReminders, (state, {payload}) => {
        return {...state, reminders: payload};
    })
    .addCase(setAppointmentId, (state, {payload}) => {
        let vehicle = state.selectedVehicle;
        if (vehicle) {
            vehicle = {...vehicle, appointmentHashKeys: [...vehicle.appointmentHashKeys, payload.hashKey]}
        }
        return {...state, ...payload, selectedVehicle: vehicle};
    })
    .addCase(setTransportation, (state, {payload}) => {
        return {...state, transportation: payload};
    })
    .addCase(setMaintenanceDetails, (state, {payload}) => {
        return {...state, maintenanceDetails: {...state.maintenanceDetails, ...payload}}
    })
)