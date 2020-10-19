import {createAction} from "@reduxjs/toolkit";
import {EOptimizationWindowType, IOptimizationWindow} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getOptimizationWindows = createAction<IOptimizationWindow[]>("OptimizationWindows/GetParams");
export const loadOptimizationWindows = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IOptimizationWindow[]>(
        Api.endpoints.OptimizationWindows.GetParams,
        {params: {serviceCenterId, podId}}
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