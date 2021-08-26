import {createAction} from "@reduxjs/toolkit";
import {ICustomer, ILoadedVehicle, IServiceCategory, IServiceConsultant} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType} from "../appointment/types";

export const selectService = createAction<IServiceCategory>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<number>("fAppointment/setPackage");
export const setAdvisor = createAction<IServiceConsultant|null>("fAppointment/setAdvisor");
export const setTiming = createAction<EAppointmentTimingType|null>("fAppointment/setTiming");
export const setTime = createAction<moment.Moment|null>("fAppointment/setTime");
export const setVehicle = createAction<ILoadedVehicle|null>("fAppointment/setVehicle");
export const setCustomer = createAction<ICustomer|null>("fAppointment/setCustomer");
export const setReminders = createAction<EReminderType[]>("fAppointment/setReminders");