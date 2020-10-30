import {createAction} from "@reduxjs/toolkit";
import {
    ETimeSlotType,
    IDesirability,
    IDesirabilityForm,
    IDesirabilityItem, IOptimizationSetting,
    IOptimizationSettingsCreateForm, IOptimizationSettingValueForm,
    IProximity
} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getProximity = createAction<IProximity[]>("SlotScoring/GetProximity");
export const loadProximity = (serviceCenterId?: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IProximity[]>(
        Api.endpoints.SlotScoring.GetProximity,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getProximity(data));
}
export const createProximity = (data: IProximity): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.SlotScoring.SetProximity,
        {data}
    );
    dispatch(loadProximity(data.serviceCenterId, data.podId));
}

export const getDesirability = createAction<IDesirability[]>("SlotScoring/GetDesirability");
export const loadDesirability = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IDesirability[]>(
        Api.endpoints.SlotScoring.GetDesirability,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getDesirability(data));
}
export const saveDesirability = (items: IDesirabilityItem[], type: ETimeSlotType, serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    const data: IDesirabilityForm = {
        podId, serviceCenterId, timeSlotType: type, items
    };
    await Api.call(Api.endpoints.SlotScoring.SetDesirability, {data});
    dispatch(loadDesirability(serviceCenterId, podId));
}

export const getOptimizationSettings = createAction<IOptimizationSetting[]>("SlotScoring/GetOptimizationSettings");
export const loadOptimizationSettings = (serviceCenterId:number, podId?:number): AppThunk => async dispatch => {
    const {data} = await Api.call<IOptimizationSetting[]>(
        Api.endpoints.SlotScoring.GetOptimization,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getOptimizationSettings(data));
}

export const setOptimizationSettings = (data: IOptimizationSettingsCreateForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.SlotScoring.SetOptimization, {data});
    dispatch(loadOptimizationSettings(data.serviceCenterId, data.podId));
}

export const setSettingValues = (data: IOptimizationSettingValueForm, serviceCenterId:number, podId?: number): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.SlotScoring.SetValues, {data});
    dispatch(loadOptimizationSettings(serviceCenterId, podId));
}