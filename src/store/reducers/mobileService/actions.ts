import {createAction} from "@reduxjs/toolkit";
import {TZone} from "./types";

export const setCurrentZone = createAction<any>('MobileService/SetCurrentZone');
export const setLoading = createAction<boolean>('MobileService/SetLoading');
export const setZones = createAction<TZone[]>('MobileService/SetZones');