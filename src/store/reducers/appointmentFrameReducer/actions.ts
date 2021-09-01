import {createAction} from "@reduxjs/toolkit";
import {
    ICustomer, IListAppointment,
    ILoadedVehicle,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType} from "../appointment/types";
import {IAppointmentId, TMaintenanceDetails} from "./types";

export const selectService = createAction<IServiceCategory>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<IPackageOptions|null>("fAppointment/setPackage");
export const setAdvisor = createAction<IServiceConsultant|null>("fAppointment/setAdvisor");
export const setTiming = createAction<EAppointmentTimingType|null>("fAppointment/setTiming");
export const setTime = createAction<moment.Moment|null>("fAppointment/setTime");
export const setVehicle = createAction<ILoadedVehicle|null>("fAppointment/setVehicle");
export const setCustomer = createAction<ICustomer>("fAppointment/setCustomer");
export const setReminders = createAction<EReminderType[]>("fAppointment/setReminders");
export const setAppointmentId = createAction<IAppointmentId>("fAppointment/setAppointmentId");
export const setTransportation = createAction<ITransportation|null>("fAppointment/setTransportation");
export const setMaintenanceDetails = createAction<Partial<TMaintenanceDetails>>("fAppointment/setMaintenanceDetails");
export const setUpdateAppointment = createAction<IListAppointment>("fAppointment/setUpdateAppointment");