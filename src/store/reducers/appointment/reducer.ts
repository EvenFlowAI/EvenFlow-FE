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
    selectSR, setLoadedReducer
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
    selectedSR: null,
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
}
export const appointmentReducer = createReducer(initialState, builder => builder
    .addCase(getServiceCenterProfile, (state, {payload}) => {
        return {...state, scProfile: payload};
    })
    .addCase(getSRs, (state, {payload}) => {
        return {...state, serviceRequests: payload};
    })
    .addCase(selectSR, (state, {payload}) => {
        return {...state, selectedSR: payload};
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
        if (appointmentSlots.length) {
            const monthIdx = appointmentSlots[0].date.month();
            appointmentSlots = appointmentSlots.filter(el => el.date.month() === monthIdx);
        }

        return {...state, appointmentSlots};
    })
    .addCase(setLoadedReducer, (state, {payload}) => {
        return {...state, ...payload};
    })
);