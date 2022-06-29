import {createAction} from "@reduxjs/toolkit";
import {TZone, TZoneNew} from "../mobileService/types";
import {AppThunk} from "../../../types/types";

export const setCurrentZone = createAction<any>('ServiceValet/SetCurrentZone');
export const setLoading = createAction<boolean>('ServiceValet/SetLoading');
export const setZones = createAction<TZone[]>('ServiceValet/SetZones');

export const loadServiceValetZones = (id: number): AppThunk => dispatch => {
// todo request
}

export const addServiceValetZone = (id: number, data: TZoneNew): AppThunk => dispatch => {
// todo request
}

export const removeServiceValetZone = (id: number, zoneId: number): AppThunk => dispatch => {
// todo request
}

export const updateServiceValetZone = (id: number, zoneId: number, data: TZone): AppThunk => dispatch => {
// todo request
}

export const removeZipFromServiceValetZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    console.log('removed zip', zip);
// todo request
}

export const assignZipToServiceValetZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    // todo request
}

export const saveLinkToServiceValetMap = (id: number, link: string): AppThunk => dispatch => {
    // todo request
}