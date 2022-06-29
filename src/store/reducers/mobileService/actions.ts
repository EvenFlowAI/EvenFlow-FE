import {createAction} from "@reduxjs/toolkit";
import {TZone, TZoneNew} from "./types";
import {AppThunk} from "../../../types/types";

export const setCurrentZone = createAction<any>('MobileService/SetCurrentZone');
export const setLoading = createAction<boolean>('MobileService/SetLoading');
export const setZones = createAction<TZone[]>('MobileService/SetZones');

export const loadMobServiceZones = (id: number): AppThunk => dispatch => {
// todo request
}

export const addMobServiceZone = (id: number, data: TZoneNew): AppThunk => dispatch => {
// todo request
}

export const removeMobServiceZone = (id: number, zoneId: number): AppThunk => dispatch => {
// todo request
}

export const updateMobServiceZone = (id: number, zoneId: number, data: TZone): AppThunk => dispatch => {
// todo request
}

export const removeZipFromMobServiceZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    console.log('removed zip', zip);
// todo request
}

export const assignZipToMobServiceZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    // todo request
}

export const saveLinkToMobServiceMap = (id: number, link: string): AppThunk => dispatch => {
    // todo request
}