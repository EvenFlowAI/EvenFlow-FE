import {createAction} from "@reduxjs/toolkit";
import {IAppointmentByQuery, IPackageAppointments} from "../../../api/types";
import {IAppointmentsRequest, IPackageRequestData} from "./types";
import {AppThunk} from "../../../types/types";
import {API} from "../../../api/api";
import {Api} from "../../../config/requests";

export const getAppointments = createAction<IAppointmentByQuery[]>("Appointments/GetAppointments");
export const getAllAppointments = createAction<IAppointmentByQuery[]>("Appointments/GetAllAppointments");
export const setAppointmentsLoading = createAction<boolean>("Appointments/SetAppointmentsLoading");
export const setAppointmentsModalLoading = createAction<boolean>("Appointments/SetAppointmentsModalLoading");
export const setAppointmentsCount = createAction<number>("Appointments/SetAppointmentsCount");
export const setAllAppointmentsCount = createAction<number>("Appointments/SetAllAppointmentsCount");
export const getPackageByVehicle = createAction<IPackageAppointments[]>("Appointments/GetPackageByVehicle");

export const loadAppointments = (data: IAppointmentsRequest): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true));
    API.appointment.list(data)
        .then(({data: {paging, result}}) => {
            if (data.pageIndex === 0 && data.pageSize === 0 && !data.date) {
                dispatch(getAllAppointments(result));
                dispatch(setAllAppointmentsCount(paging.numberOfRecords));
            } else {
                dispatch(getAppointments(result));
                dispatch(setAppointmentsCount(paging.numberOfRecords));
            }
        })
        .catch(err => {
            console.log('load appointments for calendar', err)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const loadAppointmentsForModal = (data: IAppointmentsRequest): AppThunk => dispatch => {
    dispatch(setAppointmentsModalLoading(true));
    API.appointment.list(data)
        .then(({data: {paging, result}}) => {
            if (data.pageIndex === 0 && data.pageSize === 0 && !data.date) {
                dispatch(getAllAppointments(result));
                dispatch(setAllAppointmentsCount(paging.numberOfRecords));
            } else {
                dispatch(getAppointments(result));
                dispatch(setAppointmentsCount(paging.numberOfRecords));
            }
        })
        .catch(err => {
            console.log('load appointments for calendar', err)
        })
        .finally(() => dispatch(setAppointmentsModalLoading(false)))
}

export const loadPackageByVehicle = (data: IPackageRequestData): AppThunk => dispatch => {
    dispatch(setAppointmentsModalLoading(true));
    Api.call<IPackageAppointments[]>(Api.endpoints.MaintenancePackages.ByVehicle, {data})
        .then(({data}) => {
            data && data[0] && dispatch(getPackageByVehicle([data[0]]))
        })
        .catch(err => {
            console.log('load package by vehicle', err)
        })
        .finally(() => dispatch(setAppointmentsModalLoading(false)))
}
