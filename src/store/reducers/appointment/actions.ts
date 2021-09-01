import {createAction} from "@reduxjs/toolkit";
import {
    APPOINTMENT_STATE_KEY,
    APPOINTMENT_STATE_SAVED_KEY,
    EAppointmentTimingType, EReminderType,
    ETransportation,
    IAppointmentFilters,
    IAppointmentResponse,
    IAppointmentSlot,
    IAppointmentSlotsRequest,
    IPersonalInformation,
    IPrivacy,
    IRemappedAppointmentSlot,
    IReminders,
    IServiceCenterProfile,
    ISR,
    TAppointmentState, transportations,
    TS1Form,
    TS3Form
} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import moment from "moment";
import {ICreateAppointmentResp, ICustomerLoadedData, IListAppointment, ILoadedVehicle} from "../../../api/types";
import {EDemandCategory} from "../pricingSettings/types";

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
        const res = dispatch(getAppointmentSlots(items));
        if (cb && data.appointmentTimingType === EAppointmentTimingType.FirstAvailable) {
            return cb(moment.utc(from));
        }
        return res;
    } catch {
        return dispatch(getAppointmentSlots([]));
    }
}
export const setLoadedReducer = createAction<TAppointmentState>("Appointment/ReloadState");
export const saveAppointmentReducer = (): AppThunk => (d, getState) => {
    const state = JSON.stringify({...getState().appointment});
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
export const setOldAppointmentId = createAction<ICreateAppointmentResp&{updated: boolean}>("Appointments/SetAppointmentId");
export const setAppointmentFilters = createAction<Partial<IAppointmentFilters>>("Appointment/SetFilters");
export const setCustomerEnteredEmail = createAction<string>("Appointment/SetCustomerEnteredEmail");
export const setCustomerLoadedData = createAction<ICustomerLoadedData|null>("Appointment/SetCustomerLoadedData");
export const setCustomerVehicle = createAction<ILoadedVehicle|null>("Appointment/SetCustomerVehicle");


export const setSessionId = createAction<string>("Appointment/SetSessionId");
export const setEditAppointment = createAction<TAppointmentState>("Appointment/SetEditAppointment");
export const loadEditAppointment = (appointment: IListAppointment): AppThunk => (dispatch, getState) => {
    const state = {...getState().appointment};

    state.selectedSR = appointment.serviceRequests.map(sr => sr.id);
    state.appointmentId = {
        ...appointment
    };
    state.s1Data = {
        ...state.s1Data,
        ...appointment.vehicle,
        year: String(appointment.vehicle.year || ""),
        mileage: String(appointment.vehicle.mileage || "")
    }
    state.s3Data = {
        ...state.s3Data,
        appointmentType: EAppointmentTimingType.FirstAvailable,
    }
    const tr = transportations.reduce((acc,i) => {
        return [...acc, ...i];
    }, []);
    const foundTransportation = tr.find(el => el.label === appointment.transportationNeeds.description);
    state.transportation = foundTransportation?.id ?? ETransportation.Rental;

    const date = `${
        String(appointment.dateInUtc).split("T")[0]
    }T${
        appointment.timeSlot
    }Z`;
    state.appointment = {
        id: `${appointment.dateInUtc}|${appointment.timeSlot}`,
        date: moment.utc(date),
        offer: appointment.offer,
        time: appointment.timeSlot,
        price: {
            value: appointment.transactionValue,
            category: EDemandCategory.Average
        },
        priceWithOffer: {
            value: appointment.transactionValue,
            category: EDemandCategory.Average
        },
        isShorterWaitTime: false,
    };
    const reminders: IReminders = {
        email: false,
        sms: false,
        phone: false
    }
    for (let r of appointment.reminderTypes) {
        switch (r) {
            case EReminderType.Email:
                reminders.email = true;
                break;
            case EReminderType.Phone:
                reminders.phone = true;
                break;
            case EReminderType.Sms:
                reminders.sms = true;
                break;
        }
    }
    state.reminders = reminders;
    state.comment = appointment.comment;
    state.personalInformation = {
        ...appointment.driver
    }
    state.privacy = {privacy: true, callback: appointment.isNeedCall};

    dispatch(setEditAppointment(state));
    dispatch(saveAppointmentReducer());
}

const CUSTOMER_CACHE = 'fCC';
export const saveCustomerCache = (data: ICustomerLoadedData): void => {
    localStorage.setItem(CUSTOMER_CACHE, JSON.stringify(data));
}
export const getBlankVehicle = (): ILoadedVehicle => ({
    year: null,
    mileage: null,
    appointmentHashKeys: [],
    vin: "",
    model: "",
    make: "",
    warrantyExpiration: null
})
export const getBlankCustomer = (sessionId?: string): ICustomerLoadedData => {
    return  {
        id: "",
        vehicles: [],
        lastName: "",
        firstName: "",
        emails: [],
        sessionId,
        phoneNumbers: []
    };
}
export const clearCustomerCache = (): void => {
    localStorage.removeItem(CUSTOMER_CACHE);
}
export const getCustomerCache = (): ICustomerLoadedData|null => {
    try {
        const item = localStorage.getItem(CUSTOMER_CACHE);
        if (!item) {
            return null;
        }
        return JSON.parse(item) as ICustomerLoadedData;
    } catch {
        return null;
    }
}
