import {createAction} from "@reduxjs/toolkit";
import {IServiceCategory} from "../../../api/types";

export const selectService = createAction<IServiceCategory>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<number>("fAppointment/setPackage");