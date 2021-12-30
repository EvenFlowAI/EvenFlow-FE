import {createAction} from "@reduxjs/toolkit";
import {IListAppointment} from "../../../api/types";
import {IAppointmentsRequest} from "./types";
import {AppThunk} from "../../../types/types";
import {API} from "../../../api/api";

export const getAppointments = createAction<IListAppointment[]>("Appointments/GetAppointments");
export const setAppointmentsLoading = createAction<boolean>("Appointments/SetAppointmentsLoading");
export const setAppointmentsCount = createAction<number>("Appointments/SetAppointmentsCount");

export const loadAppointments = (data: IAppointmentsRequest): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true));
    API.appointment.list(data)
        .then(({data: {paging, result}}) => {
            dispatch(getAppointments(result));
            dispatch(setAppointmentsCount(paging.numberOfRecords));
        })
        .catch(err => {
            console.log('load appointments for calendar', err)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}