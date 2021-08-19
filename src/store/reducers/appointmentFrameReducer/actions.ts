import {createAction} from "@reduxjs/toolkit";
import {TServiceCard} from "./types";

export const selectService = createAction<TServiceCard>("fAppointment/selectService");
export const selectSubService = createAction<TServiceCard>("fAppointment/selectSubService");