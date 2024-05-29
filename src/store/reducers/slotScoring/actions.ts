import {createAction} from "@reduxjs/toolkit";
import {
    ETimeSlotType,
    IDesirability,
    IDesirabilityForm,
    IDesirabilityItem, IOptimizationSetting,
    IOptimizationSettingsCreateForm, IOptimizationSettingValueForm,
    IProximity, ISlotRange
} from "./types";
import {AppThunk} from "../../../types/types";
import {IHOODataForm} from "../serviceCenters/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";
import {loadingEmployeesSchedule} from "../schedules/actions";
import {EDesirabilityDays} from "../../../features/admin/TimeOfDayDesirability/AppointmentSlotsDesirability/types";

export const setLoading = createAction<boolean>("SlotScoring/SetLoading");

export const getProximity = createAction<IProximity[]>("SlotScoring/GetProximity");
export const loadProximity = (serviceCenterId?: number, podId?: number): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    try {
        const {data} = await Api.call<IProximity[]>(
            Api.endpoints.SlotScoring.GetProximity,
            {params: {serviceCenterId, podId}}
        );
        dispatch(getProximity(data));
    } catch (err) {
        console.log(err)
    } finally {
        dispatch(setLoading(false))
    }
}
export const createProximity = (data: IProximity): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    try {
        await Api.call(
            Api.endpoints.SlotScoring.SetProximity,
            {data}
        );
        dispatch(loadProximity(data.serviceCenterId, data.podId));
    } catch (err) {
        console.log(err)
    } finally {
        dispatch(setLoading(false))
    }
}

export const getDesirability = createAction<IDesirability[]>("SlotScoring/GetDesirability");
export const loadDesirability = (serviceCenterId: number, dayOfWeek: EDesirabilityDays|null, podId?: number, errorCallback?: (err: {errorCode: number; message: string}) => void): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    let params =  dayOfWeek !== null
        ? {serviceCenterId, podId, dayOfWeek}
        : {serviceCenterId, podId};
    Api.call<IDesirability[]>(
        Api.endpoints.SlotScoring.GetDesirability,
        {params}
    ).then(({data}) => {
        dispatch(getDesirability(data));
    }).catch(err => {
        console.log('err load desirability', err)
        dispatch(getDesirability([]));
        errorCallback && errorCallback(err);
        dispatch(setLoading(false));
    })
}
export const saveDesirability = (
    items: IDesirabilityItem[],
    type: ETimeSlotType,
    serviceCenterId: number,
    dayOfWeek: EDesirabilityDays|null,
    podId?: number,
    callback?: () => void,
    errCallback?: (err: {errorCode: number; message: string}) => void,
): AppThunk => dispatch => {
    const data: IDesirabilityForm = {
        podId, serviceCenterId, timeSlotType: type, items
    };
    if (dayOfWeek !== null) data.dayOfWeek = dayOfWeek
   Api.call(Api.endpoints.SlotScoring.SetDesirability, {data})
       .then(() => {
           callback && callback()
           dispatch(loadDesirability(serviceCenterId, dayOfWeek, podId));
           }
       )
       .catch(err => {
           console.log(err)
           errCallback && errCallback(err)
   })
}

export const getOptimizationSettings = createAction<IOptimizationSetting[]>("SlotScoring/GetOptimizationSettings");
export const loadOptimizationSettings = (serviceCenterId:number, podId?:number): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    try {
        const {data} = await Api.call<IOptimizationSetting[]>(
            Api.endpoints.SlotScoring.GetOptimization,
            {params: {serviceCenterId, podId}}
        );
        dispatch(getOptimizationSettings(data));
    } catch (err) {
        console.log(err)
    } finally {
        dispatch(setLoading(false))
    }
}

export const setOptimizationSettings = (data: IOptimizationSettingsCreateForm): AppThunk => async dispatch => {
   try {
       await Api.call(Api.endpoints.SlotScoring.SetOptimization, {data});
       dispatch(loadOptimizationSettings(data.serviceCenterId, data.podId));
   } catch (err) {
       console.log(err)
   }
}

export const setSettingValues = (data: IOptimizationSettingValueForm, serviceCenterId:number, podId?: number): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    try {
        await Api.call(Api.endpoints.SlotScoring.SetValues, {data});
        dispatch(loadOptimizationSettings(serviceCenterId, podId));
    } catch (err) {
        console.log(err)
    } finally {
        dispatch(setLoading(false))
    }
}

export const getRange = createAction<ISlotRange>("SlotScoring/GetRange");
export const loadRange = (serviceCenterId: number, dayOfWeek: EDesirabilityDays|null, podId?: number): AppThunk => dispatch => {
    const data = dayOfWeek !== null ? {dayOfWeek, serviceCenterId, podId} : {serviceCenterId, podId}
    Api.call(Api.endpoints.SlotScoring.GetRange, {params: data})
        .then(result => {
            if (result?.data) {
                dispatch(getRange(result.data));
            }
        })
        .catch(err => {
            console.log('load slot range error', err)
        })
}

export const loadHoursOfOperations = (id: number): AppThunk => dispatch => {
    dispatch(loadingEmployeesSchedule(true))
    Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id}})
        .then(result => {
            if (result?.data) {
                const startTimes = result.data.map(item => dayjs(item.from, 'HH:mm:ss'));
                const endTimes = result.data.map(item => dayjs(item.to, 'HH:mm:ss'));
                const maxTime = dayjs.max(endTimes)?.format('HH:mm:ss');
                const minTime = dayjs.min(startTimes)?.format('HH:mm:ss');
                if (maxTime && minTime) {
                    const data: ISlotRange = {
                        start: minTime,
                        end: maxTime,
                    }
                    dispatch(getRange(data));
                }
            }
        })
        .catch(err => {
            console.log('get hours of operations error', err)
        })
        .finally(() => dispatch(loadingEmployeesSchedule(false)))
}