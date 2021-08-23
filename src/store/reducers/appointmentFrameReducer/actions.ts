import {createAction} from "@reduxjs/toolkit";
import {IServiceCategory, IServiceConsultant} from "../../../api/types";

export const selectService = createAction<IServiceCategory>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<number>("fAppointment/setPackage");
export const setAdvisor = createAction<IServiceConsultant|null>("fAppointment/setAdvisor");