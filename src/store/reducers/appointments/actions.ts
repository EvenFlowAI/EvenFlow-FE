import {createAction} from "@reduxjs/toolkit";
import {IListAppointment} from "../../../api/types";
import {IAppointmentsRequest} from "./types";
import {AppThunk} from "../../../types/types";
import {API} from "../../../api/api";

export const getAppointments = createAction<IListAppointment[]>("Appointments/GetAppointments");
export const getAllAppointments = createAction<IListAppointment[]>("Appointments/GetAllAppointments");
export const setAppointmentsLoading = createAction<boolean>("Appointments/SetAppointmentsLoading");
export const setAppointmentsModalLoading = createAction<boolean>("Appointments/SetAppointmentsModalLoading");
export const setAppointmentsCount = createAction<number>("Appointments/SetAppointmentsCount");
export const setAllAppointmentsCount = createAction<number>("Appointments/SetAllAppointmentsCount");

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
