import {ActionCreator} from "redux";
import {
    AppThunk,
    TArgCallback,
    TCallback
} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {createAction} from "@reduxjs/toolkit";
import {ECapacityType, IAdvisorCapacity, ITechnicianCapacity, TTechniciansResponse} from "./types";

export const setLoading = createAction<boolean>("EmployeeCapacity/SetLoading");
export const getAdvisorsCapacity = createAction<IAdvisorCapacity[]>("EmployeeCapacity/GetAdvisorsCapacity");
export const getTechniciansCapacity = createAction<ITechnicianCapacity[]>("EmployeeCapacity/GetTechniciansCapacity");
export const getCapacityTypeOption = createAction<ECapacityType|null>("EmployeeCapacity/GetCapacityTypeOption");

export const loadAdvisorsCapacity = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call<IAdvisorCapacity[]>(Api.endpoints.EmployeeCapacity.GetAdvisorsCapacity, {params: {serviceCenterId}})
        .then(res => {
            if (res.data) dispatch(getAdvisorsCapacity(res.data))
        })
        .catch(err => {
            console.log('get advisors capacity error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadTechniciansCapacity = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call<TTechniciansResponse>(Api.endpoints.EmployeeCapacity.GetTechniciansCapacity, {params: {serviceCenterId}})
        .then(res => {
            if (res.data) {
                dispatch(getTechniciansCapacity(res.data.technicianCapacitySettings))
                dispatch(getCapacityTypeOption(res.data.capacityTypeOption))
            }
        })
        .catch(err => {
            console.log('get advisors capacity error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

