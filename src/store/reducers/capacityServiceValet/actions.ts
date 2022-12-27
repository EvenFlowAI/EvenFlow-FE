import {createAction} from "@reduxjs/toolkit";
import {IZonesRoutingByDay, IZoneTimeSlot} from "./types";
import {AppThunk} from "../../../types/types";

export const getZonesRouting = createAction<IZonesRoutingByDay[]>('ServiceValetCapacity/GetZonesRouting');
export const setZoneTimeWindows = createAction<IZoneTimeSlot[]>('ServiceValetCapacity/SetZoneTimeWindows');
export const setLoading = createAction<boolean>('ServiceValetCapacity/SetLoading');

export const loadZonesRouting = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    dispatch(setLoading(false))
}