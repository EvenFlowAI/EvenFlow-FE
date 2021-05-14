import {createAction} from "@reduxjs/toolkit";
import {EOptimizationWindowType, IAppointmentCutoff, IOptimizationWindow, IOverbookingFactor} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import moment from "moment";

export const getOptimizationWindows = createAction<IOptimizationWindow[]>("OptimizationWindows/GetParams");
export const loadOptimizationWindows = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IOptimizationWindow[]>(
        Api.endpoints.OptimizationWindows.GetParams,
        {params: {serviceCenterId, podId, day: moment().day()}}
    );
    dispatch(getOptimizationWindows(data));
}
export const setOptimizationWindow = (
    type: EOptimizationWindowType, value: number, serviceCenterId: number, podId?: number
): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.OptimizationWindows.SetParams,
        {
            data: {type, value, serviceCenterId, podId}
        }
    );
    dispatch(loadOptimizationWindows(serviceCenterId, podId));
}
export const getOverbookingFactor = createAction<IOverbookingFactor[]>("OptimizationWindows/GetOverbooking");
export const loadOverbookingFactor = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IOverbookingFactor[]>(
        Api.endpoints.OptimizationWindows.GetOverbooking,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getOverbookingFactor(data));
}
export const setOverbookingFactor = (data: IOverbookingFactor[]): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.OptimizationWindows.SetOverbooking,
        {
            data: {
                serviceCenterId: data[0].serviceCenterId,
                podId: data[0].podId,
                items: data
            }
        }
    )
    dispatch(loadOptimizationWindows(data[0].serviceCenterId, data[0].podId));
}
export const getAppointmentCutoff = createAction<IAppointmentCutoff[]>("OptimizationWindows/GetAppointmentCutoff");
export const loadAppointmentCutoff = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IAppointmentCutoff[]>(
        Api.endpoints.OptimizationWindows.GetAppointmentCutoff,
        { params: {serviceCenterId, podId} }
    );
    dispatch(getAppointmentCutoff(data));
}
export const setAppointmentCutoff = (data: IAppointmentCutoff[], serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.OptimizationWindows.SetAppointmentCutoff,
        {
            data: {
                items: data,
                serviceCenterId,
                podId
            }
        }
    )
    dispatch(loadOptimizationWindows(serviceCenterId, podId));
}