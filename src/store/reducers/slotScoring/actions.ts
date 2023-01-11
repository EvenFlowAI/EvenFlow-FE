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
import {Api} from "../../../config/requests";
import {IHOODataForm} from "../serviceCenters/types";
import moment from "moment";

export const setLoading = createAction<boolean>("SlotScoring/SetLoading");

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
export const loadDesirability = (serviceCenterId: number, podId?: number, errorCallback?: (err: {errorCode: number; message: string}) => void): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    Api.call<IDesirability[]>(
        Api.endpoints.SlotScoring.GetDesirability,
        {params: {serviceCenterId, podId}}
    ).then(({data}) => {
        dispatch(getDesirability(data));
    }).catch(err => {
        console.log('err load desirability', err)
        dispatch(getDesirability([]));
        errorCallback && errorCallback(err);
    }).finally(() => {
        dispatch(setLoading(false));
    })
}
export const saveDesirability = (
    items: IDesirabilityItem[],
    type: ETimeSlotType,
    serviceCenterId: number,
    podId?: number,
    callback?: () => void,
    errCallback?: (err: {errorCode: number; message: string}) => void,
): AppThunk => dispatch => {
    const data: IDesirabilityForm = {
        podId, serviceCenterId, timeSlotType: type, items
    };
   Api.call(Api.endpoints.SlotScoring.SetDesirability, {data})
       .then(() => {
           callback && callback()
           dispatch(loadDesirability(serviceCenterId, podId));
           }
       )
       .catch(err => {
           console.log(err)
           errCallback && errCallback(err)
   })
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

export const getRange = createAction<ISlotRange>("SlotScoring/GetRange");
export const loadRange = (serviceCenterId: number, podId?: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    const data = {serviceCenterId, podId}
    Api.call(Api.endpoints.SlotScoring.GetRange, {params: data})
        .then(result => {
            if (result?.data) {
                dispatch(getRange(result.data));
            }
        })
        .catch(err => {
            console.log('load slot range error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadHorsOfOperationsToGetRange = (id: number): AppThunk => dispatch => {
    Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id}})
        .then(result => {
            if (result?.data) {
                const startTimes = result.data.map(item => moment(item.from, 'HH:mm:SS'));
                const endTimes = result.data.map(item => moment(item.to, 'HH:mm:SS'));
                const maxTime = moment.max(endTimes).format('HH:mm:SS');
                const minTime = moment.min(startTimes).format('HH:mm:SS');
                const data: ISlotRange = {
                    start: minTime,
                    end: maxTime,
                }
                dispatch(getRange(data));
            }
        })
        .catch(err => {
            console.log('get hours of operations error', err)
        })
}