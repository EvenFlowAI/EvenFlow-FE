import {createAction} from "@reduxjs/toolkit";
import {TZone} from "./types";
import {AppThunk} from "../../../types/types";

export const setCurrentZone = createAction<any>('MobileService/SetCurrentZone');
export const setLoading = createAction<boolean>('MobileService/SetLoading');
export const setZones = createAction<TZone[]>('MobileService/SetZones');

export const loadZones = (id: number): AppThunk => dispatch => {
// todo request
}

export const addZone = (id: number): AppThunk => dispatch => {
// todo request
}

export const removeZone = (id: number, zoneId: number): AppThunk => dispatch => {
// todo request
}

export const updateZone = (id: number, zoneId: number): AppThunk => dispatch => {
// todo request
}