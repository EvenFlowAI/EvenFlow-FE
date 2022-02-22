import {createReducer} from "@reduxjs/toolkit";
import {
    EAppointmentTimingType,
    IPersonalInformation,
    IPrivacy,
    IReminders,
    TAppointmentState,
    TS1Form,
    TS3Form
} from "./types";
import {
    changeComment,
    changePersonalInformation,
    changePrivacy,
    changeReminders,
    changeS1Form,
    changeS3Form,
    changeTransportation, getAllServiceCategories,
    getAppointmentSlots, getServiceCategories,
    getServiceCenterProfile,
    getSRs,
    handleSearch,
    selectAppointment,
    selectSR, selectSRMultiple,
    setAppointmentFilters,
    setCustomerEnteredEmail,
    setCustomerLoadedData,
    setCustomerVehicle, setEditAppointment, setLoadedDateRange,
    setLoadedReducer, setOldAppointmentId, setSessionId
} from "./actions";
import moment from "moment";
import {selectService, selectSubService, setPackage} from "../appointmentFrameReducer/actions";

const blankPersonalInfo: IPersonalInformation = {
    fullName: "",
    email: "",
    phoneNumber: ""
}
const blankReminders: IReminders = {
    email: false,
    phone: false,
    sms: false
}
const blankPrivacy: IPrivacy = {
    privacy: false,
    callback: false
}

const initialS1Form: TS1Form = {
    year: null,
    vin: "",
    mileage: null,
    driveType: "",
    engineType: "",
    make: "",
    model: "",
    transmission: ""
}
const initialS3Form: TS3Form = {
    appointmentType: EAppointmentTimingType.SpecialOffers
}
const initialState: TAppointmentState = {
    sessionId: "",
    updated: false,
    searchedDateRange: null,
    serviceRequests: [],
    customerLoadedData: null,
    customerSelectedVehicle: null,
    customerEnteredEmail: "",
    appointmentId: null,
    selectedSR: [],
    s1Data: initialS1Form,
    search: "",
    s3Data: initialS3Form,
    transportation: null,
    personalInformation: blankPersonalInfo,
    reminders: blankReminders,
    privacy: blankPrivacy,
    comment: "",
    appointment: null,
    appointmentSlots: [],
    appointmentFilters: {
        offersOnly: false,
        waitTimeOnly: false
    },
    serviceCategories: [],
    allServiceCategories: [],
}
export const appointmentReducer = createReducer(initialState, builder => builder
    .addCase(getServiceCenterProfile, (state, {payload}) => {
        return {...state, scProfile: payload};
    })
    .addCase(getSRs, (state, {payload}) => {
        return {...state, serviceRequests: payload};
    })
    .addCase(selectSR, (state, {payload}) => {
        if (payload === null) {
            return {...state, selectedSR: []};
        }
        let selected = [...state.selectedSR];
        if (selected.includes(payload)) {
            selected = selected.filter(id => id !== payload);
        } else {
            selected = [...selected, payload];
        }
        return {...state, selectedSR: selected};
    })
    .addCase(changeS1Form, (state, {payload}) => {
        return {...state, s1Data: {...state.s1Data, ...payload}};
    })
    .addCase(handleSearch, (state, {payload}) => {
        return {...state, search: payload};
    })
    .addCase(changeS3Form, (state, {payload}) => {
        return {...state, s3Data: {...state.s3Data, ...payload, date: payload.date || undefined}};
    })
    .addCase(changeTransportation, (state, {payload}) => {
        return {...state, transportation: payload};
    })
    .addCase(changeReminders, (state, {payload}) => {
        return {...state, reminders: {...state.reminders, ...payload}};
    })
    .addCase(changePrivacy, (state, {payload}) => {
        return {...state, privacy: {...state.privacy, ...payload}};
    })
    .addCase(changePersonalInformation, (state, {payload}) => {
        return {...state, personalInformation: {...state.personalInformation, ...payload}};
    })
    .addCase(changeComment, (state, {payload}) => {
        return {...state, comment: payload};
    })
    .addCase(selectAppointment, (state, {payload}) => {
        return {...state, appointment: payload};
    })
    .addCase(setLoadedDateRange, (state, {payload}) => {
        return {...state, searchedDateRange: payload};
    })
    .addCase(getAppointmentSlots, (state, {payload}) => {
        if (payload.length && state.appointment) {
            const {appointment} = state;
            if (!Boolean(payload.find(sl =>
                sl.time === appointment.time && sl.date === appointment.id.split("|")[0]
            ))) {
                payload = [{...appointment, date: appointment.id.split("|")[0]}, ...payload];
            }
        }
        let appointmentSlots = payload.map(sl => {
            const date = `${String(sl.date).split("T")[0]}T${sl.time}Z`;
            return {...sl, id: `${sl.date}|${sl.time}`, date: moment.utc(date)}
        });

        return {...state, appointmentSlots};
    })
    .addCase(setLoadedReducer, (state, {payload}) => {
        return {...state, ...payload};
    })
    .addCase(setOldAppointmentId, (state, {payload: {updated, ...payload}}) => {
        return {...state, appointmentId: payload, updated};
    })
    .addCase(setAppointmentFilters, (state, {payload}) => {
        return {...state, appointmentFilters: {...state.appointmentFilters, ...payload}};
    })
    .addCase(setCustomerEnteredEmail, (state, {payload}) => {
        return {...state, customerEnteredEmail: payload};
    })
    .addCase(setCustomerLoadedData, (state, {payload}) => {
        if (payload) {
            const nState = {
                ...state,
                customerLoadedData: payload,
                personalInformation: {
                    ...state.personalInformation,
                    fullName: `${payload.firstName} ${payload.lastName}`,
                    email: payload.emails[0] || state.customerEnteredEmail,
                    phoneNumber: payload.phoneNumbers[0] || ""
                }
            };
            if (payload.vehicles.length === 1) {
                nState.s1Data = {
                    ...nState.s1Data,
                    ...payload.vehicles[0],
                    year: String(payload.vehicles[0].year),
                    mileage: String(payload.vehicles[0].mileage)
                }
            }
            return nState;
        }
        return {
            ...state,
            customerLoadedData: payload
        };
    })
    .addCase(setCustomerVehicle, (state, {payload}) => {
        if (payload) {
            return {
                ...state,
                customerSelectedVehicle: payload,
                s1Data: {
                    ...state.s1Data,
                    ...payload,
                    mileage: String(payload.mileage),
                    year: String(payload.year)
                }
            }
        }
        return {
            ...state,
            customerSelectedVehicle: payload,
            s1Data: {...initialS1Form}
        };
    })
    .addCase(setEditAppointment, (state, {payload}) => {
        return payload;
    })
    .addCase(setSessionId, (state, {payload}) => {
        if (state.customerLoadedData) {
            return {
                ...state,
                sessionId: payload,
                customerLoadedData: {...state.customerLoadedData, sessionId: payload}
            };
        }
        return {...state, sessionId: payload};
    })
    .addCase(selectService, (state) => {
        return {...state, appointment: null}
    })
    .addCase(selectSubService, (state) => {
        return {...state, appointment: null}
    })
    .addCase(setPackage, (state) => {
        return {...state, appointment: null}
    })
    .addCase(getServiceCategories, (state, { payload }) => {
        return {...state, serviceCategories: payload};
    })
    .addCase(getAllServiceCategories, (state, { payload }) => {
        return {...state, allServiceCategories: payload};
    })
    .addCase(selectSRMultiple, (state, {payload}) => {
        return {...state, selectedSR: payload};
    })
);