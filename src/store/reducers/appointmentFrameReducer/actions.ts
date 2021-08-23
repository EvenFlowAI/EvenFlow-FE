import {createAction} from "@reduxjs/toolkit";
import {IServiceCategory, IServiceConsultant} from "../../../api/types";
import {ETiming} from "./types";
import moment from "moment";

export const selectService = createAction<IServiceCategory>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<number>("fAppointment/setPackage");
export const setAdvisor = createAction<IServiceConsultant|null>("fAppointment/setAdvisor");
export const setTiming = createAction<ETiming|null>("fAppointment/setTiming");
export const setTime = createAction<moment.Moment|null>("fAppointment/setTime");