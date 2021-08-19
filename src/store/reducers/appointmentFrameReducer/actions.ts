import {createAction} from "@reduxjs/toolkit";
import {TServiceCard} from "./types";

export const selectService = createAction<TServiceCard>("fAppointment/selectService");
export const selectSubService = createAction<TServiceCard>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<number>("fAppointment/setPackage");