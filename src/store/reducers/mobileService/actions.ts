import {createAction} from "@reduxjs/toolkit";
import {TZone, TZoneNew} from "./types";
import {AppThunk} from "../../../types/types";

export const setCurrentZone = createAction<any>('MobileService/SetCurrentZone');
export const setLoading = createAction<boolean>('MobileService/SetLoading');
export const setZones = createAction<TZone[]>('MobileService/SetZones');

export const loadZones = (id: number): AppThunk => dispatch => {
// todo request
}

export const addZone = (id: number, data: TZoneNew): AppThunk => dispatch => {
// todo request
}

export const removeZone = (id: number, zoneId: number): AppThunk => dispatch => {
// todo request
}

export const updateZone = (id: number, zoneId: number, data: TZone): AppThunk => dispatch => {
// todo request
}

export const removeZipFromZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    console.log('removed zip', zip);
// todo request
}

export const assignZipToZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    // todo request
}