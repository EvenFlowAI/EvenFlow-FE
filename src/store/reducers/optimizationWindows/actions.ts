import {createAction} from "@reduxjs/toolkit";
import {
    EOptimizationWindowType,
    IAppointmentCutoff,
    IOptimizationWindow,
    IOverbookingFactor,
    IWaitListSettings
} from "./types";
import {AppThunk, TArgCallback, TCallback} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";

export const getOptimizationWindows = createAction<IOptimizationWindow[]>("OptimizationWindows/GetParams");
export const loadOptimizationWindows = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    try {
        const {data} = await Api.call<IOptimizationWindow[]>(
            Api.endpoints.OptimizationWindows.GetParams,
            {params: {serviceCenterId, podId, day: dayjs().day()}}
        );
        dispatch(getOptimizationWindows(data));
    } catch (err) {
        console.log(err)
    }
}
export const setOptimizationWindow = (
    type: EOptimizationWindowType, value: number, serviceCenterId: number, podId?: number
): AppThunk => async dispatch => {
    try {
        await Api.call(
            Api.endpoints.OptimizationWindows.SetParams,
            {
                data: {type, value, serviceCenterId, podId}
            }
        );
        dispatch(loadOptimizationWindows(serviceCenterId, podId));
    } catch (err) {
        console.log(err)
    }
}
export const getOverbookingFactor = createAction<IOverbookingFactor[]>("OptimizationWindows/GetOverbooking");
export const loadOverbookingFactor = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
   try {
       const {data} = await Api.call<IOverbookingFactor[]>(
           Api.endpoints.OptimizationWindows.GetOverbooking,
           {params: {serviceCenterId, podId}}
       );
       dispatch(getOverbookingFactor(data));
   } catch (err) {
       console.log(err)
   }
}
export const setOverbookingFactor = (data: IOverbookingFactor[], onSuccess?: () => void, onError?: (err: string) => void): AppThunk => dispatch => {
    Api.call(
        Api.endpoints.OptimizationWindows.SetOverbooking,
        {
            data: {
                serviceCenterId: data[0].serviceCenterId,
                podId: data[0].podId,
                items: data
            }
        }
    ).then(res => {
        if (res) {
            onSuccess && onSuccess()
            dispatch(loadOverbookingFactor(data[0].serviceCenterId, data[0].podId))
        }
    }).catch(err => {
        onError && onError(err)
        console.log('set overbooking factor error', err)
    })
}
export const getAppointmentCutoff = createAction<IAppointmentCutoff[]>("OptimizationWindows/GetAppointmentCutoff");
export const loadAppointmentCutoff = (serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
  try {
      const {data} = await Api.call<IAppointmentCutoff[]>(
          Api.endpoints.OptimizationWindows.GetAppointmentCutoff,
          { params: {serviceCenterId, podId} }
      );
      dispatch(getAppointmentCutoff(data));
  } catch (err) {
      console.log(err)
  }
}
export const setAppointmentCutoff = (data: IAppointmentCutoff[], serviceCenterId: number, podId?: number): AppThunk => async dispatch => {
    try {
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
    } catch (err) {
        console.log(err)
    }
}

export const getMaxPriceDateRange = createAction<number>("OptimizationWindows/GetMaxPriceDateRange");
export const loadMaxPriceDateRange = (id: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCenters.GetMaxPriceDateRange, {urlParams: {id}})
        .then(result => {
            dispatch(getMaxPriceDateRange(result.data))
        })
        .catch(err => {
            console.log('get max price date range error', err)
        })
}

export const updateMaxPriceDateRange = (id: number, daysCount: number, onError: TArgCallback<any>, onSuccess: TCallback): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCenters.UpdateMaxPriceDateRange, {urlParams: {id}, data: {daysCount}})
        .then(result => {
            if (result) dispatch(loadMaxPriceDateRange(id))
            onSuccess()
        })
        .catch(err => {
            onError(err)
            console.log('update max price date range error', err)
        })
}

export const getWaitListSettings = createAction<IWaitListSettings>("OptimizationWindows/GetWaitListSettings");
export const setWaitListLoading = createAction<boolean>("OptimizationWindows/SetWaitListLoading");

export const loadWaitListSettings = (serviceCenterId: number, podId?: number): AppThunk => dispatch => {
    dispatch(setWaitListLoading(true))
    Api.call(Api.endpoints.WaitListSettings.Get, {params: {serviceCenterId, podId}})
        .then(res => {
            if (res?.data) {
                dispatch(getWaitListSettings(res.data))
            }
        })
        .catch(err => {
            console.log('get waitlist settings error', err)
        })
        .finally(() => dispatch(setWaitListLoading(false)))
}

export const toggleWaitListFunctionality = (serviceCenterId: number, isEnabled: boolean, podId?: number): AppThunk => dispatch => {
    dispatch(setWaitListLoading(true))
    Api.call(Api.endpoints.WaitListSettings.Toggle, {data: {serviceCenterId, podId, isEnabled}})
        .then(res => {
            if (res?.data) {
                dispatch(loadWaitListSettings(serviceCenterId, podId))
            }
        })
        .catch(err => {
            console.log('toggle waitlist functionality error', err)
        })
        .finally(() => dispatch(setWaitListLoading(false)))
}

export const updateWaitListSettings = (data: IWaitListSettings, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setWaitListLoading(true))
    Api.call(Api.endpoints.WaitListSettings.Update, {data})
        .then(res => {
            if (res?.data) {
                dispatch(loadWaitListSettings(data.serviceCenterId, data.podId ?? undefined))
                onSuccess()
            }
        })
        .catch(err => {
            onError(err)
            console.log('toggle waitlist functionality error', err)
        })
        .finally(() => dispatch(setWaitListLoading(false)))
}