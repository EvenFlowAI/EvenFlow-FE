import {createAction} from "@reduxjs/toolkit";
import {ITimeRangeAndCapacity, IZonesRoutingByDay, IZoneTimeReservation, IZoneTimeSlot} from "./types";
import {AppThunk} from "../../../types/types";
import {serviceCenterReducer} from "../serviceCenters/reducer";

export const getZonesRouting = createAction<IZonesRoutingByDay[]>('ServiceValetCapacity/GetZonesRouting');
export const setZoneTimeWindows = createAction<IZoneTimeSlot[]>('ServiceValetCapacity/SetZoneTimeWindows');
export const setZoneCapacity = createAction<IZoneTimeReservation[]>('ServiceValetCapacity/SetZoneCapacity');
export const setTimeRangesAndCapacity = createAction<ITimeRangeAndCapacity[]>('ServiceValetCapacity/SetTimeRangesAndCapacity');
export const setLoading = createAction<boolean>('ServiceValetCapacity/SetLoading');

export const loadZonesRouting = (serviceCenterId: number): AppThunk => dispatch => {
}

export const loadTimeRangesAndCapacity = (serviceCenterId: number): AppThunk => dispatch => {
}

export const createTimeRange = (serviceCenterId: number, data: ITimeRangeAndCapacity, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {

}

export const updateTimeRange = (id: number, data: ITimeRangeAndCapacity, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {

}