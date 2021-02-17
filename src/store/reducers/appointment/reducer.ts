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
    changeTransportation,
    getAppointmentSlots,
    getServiceCenterProfile,
    getSRs,
    handleSearch,
    selectAppointment,
    selectSR,
    setAppointmentFilters,
    setAppointmentId,
    setCustomerEnteredEmail,
    setCustomerLoadedData,
    setCustomerVehicle,
    setLoadedReducer
} from "./actions";
import moment from "moment";

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
    }
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
    .addCase(getAppointmentSlots, (state, {payload}) => {
        let appointmentSlots = payload.map(sl => {
            const timeSplit = sl.time.split(":");
            return {...sl, id: `${sl.date}|${sl.time}`, date: moment(sl.date).set({
                    hour: Number(timeSplit[0]), minute: Number(timeSplit[1]), second: Number(timeSplit[2])
                })}
        });

        return {...state, appointmentSlots};
    })
    .addCase(setLoadedReducer, (state, {payload}) => {
        return {...state, ...payload};
    })
    .addCase(setAppointmentId, (state, {payload}) => {
        return {...state, appointmentId: payload};
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
);