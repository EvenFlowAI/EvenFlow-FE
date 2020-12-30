import {createAction} from "@reduxjs/toolkit";
import {
    APPOINTMENT_STATE_KEY, APPOINTMENT_STATE_SAVED_KEY,
    EAppointmentTimingType,
    ETransportation,
    IAppointmentResponse,
    IAppointmentSlot,
    IAppointmentSlotsRequest,
    IPersonalInformation,
    IPrivacy,
    IRemappedAppointmentSlot,
    IReminders,
    IServiceCenterProfile,
    ISR, TAppointmentState,
    TS1Form,
    TS3Form
} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import moment from "moment";

export const getServiceCenterProfile = createAction<IServiceCenterProfile>("Appointment/GetSCProfile");
export const loadSCProfile = (id: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IServiceCenterProfile>(
        Api.endpoints.ServiceCenters.Retrieve,
        {urlParams: {id}}
    )
    dispatch(getServiceCenterProfile(data));
}
export const getSRs = createAction<ISR[]>("Appointment/GetSRs");
export const loadSRs = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<ISR>>(
        Api.endpoints.ServiceRequests.GetShort,
        {
            params: {
                serviceCenterId, pageSize: 0,
                searchTerm: getState().appointment.search
            }
        }
    );
    dispatch(getSRs(result));
}
export const selectSR = createAction<number|null>("Appointment/SelectSR");
export const changeS1Form = createAction<Partial<TS1Form>>("Appointment/ChangeS1Form");
export const handleSearch = createAction<string>("Appointment/Search");
export const changeS3Form = createAction<Partial<TS3Form>>("Appointment/ChangeS3Form");
export const changeTransportation = createAction<ETransportation>("Appointment/Transportation");
export const changeReminders = createAction<Partial<IReminders>>("Appointment/ChangeReminders");
export const changePrivacy = createAction<Partial<IPrivacy>>("Appointment/ChangePrivacy");
export const changePersonalInformation = createAction<Partial<IPersonalInformation>>("Appointment/ChangePersonalInformation");
export const changeComment = createAction<string>("Appointment/ChangeComment");
export const selectAppointment = createAction<IRemappedAppointmentSlot|null>("Appointment/SelectAppointment");

export const getAppointmentSlots = createAction<IAppointmentSlot[]>("Appointment/GetAppointmentSlots");
export const loadAppointmentSlots = (data: IAppointmentSlotsRequest, cb?: (d: moment.Moment) => void): AppThunk => async dispatch => {
    try {
        const {data: {items, searchedDateRange: {from}}} = await Api.call<IAppointmentResponse>(
            Api.endpoints.AppointmentSlots.GetSlots,
            {data}
        );
        dispatch(getAppointmentSlots(items));
        if (cb && data.appointmentTimingType === EAppointmentTimingType.FirstAvailable) {
            cb(moment.utc(from));
        }
    } catch {
        dispatch(getAppointmentSlots([]));
    }
}
export const setLoadedReducer = createAction<TAppointmentState>("Appointment/ReloadState");
export const saveAppointmentReducer = (): AppThunk => (d, getState) => {
    const state = JSON.stringify(getState().appointment);
    localStorage.setItem(APPOINTMENT_STATE_KEY, state);
    localStorage.setItem(APPOINTMENT_STATE_SAVED_KEY, moment().toISOString());
}
export const clearStorage = () => {
    localStorage.removeItem(APPOINTMENT_STATE_KEY);
    localStorage.removeItem(APPOINTMENT_STATE_SAVED_KEY);
}
export const loadAppointmentReducer = (): AppThunk => async (dispatch) => {
    const date = localStorage.getItem(APPOINTMENT_STATE_SAVED_KEY);
    if (!date) {
        clearStorage();
    } else {
        if (moment().diff(moment(date), "hours") >= 1) {
            clearStorage();
        } else {
            try {
                const i = localStorage.getItem(APPOINTMENT_STATE_KEY);
                if (!i) {
                    clearStorage();
                } else {
                    const data: TAppointmentState = JSON.parse(i);
                    await dispatch(setLoadedReducer(data));
                    localStorage.setItem(APPOINTMENT_STATE_SAVED_KEY, moment().toISOString());
                }
            } catch {
                clearStorage();
            }
        }
    }
}
export const setAppointmentId = createAction<number|null>("Appointments/SetAppointmentId");
