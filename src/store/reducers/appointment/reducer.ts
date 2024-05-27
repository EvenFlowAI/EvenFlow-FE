import {createReducer} from "@reduxjs/toolkit";
import {IPersonalInformation, IPrivacy, IReminders, TAppointmentState} from "./types";
import {
    changePersonalInformation,
    changePrivacy,
    changeReminders,
    getAllServiceCategories,
    getAppointmentSlots,
    getDropOffSettings,
    getServiceCategories,
    getServiceCenterProfile,
    getServiceValetSlots,
    getSRs,
    handleSearch,
    selectAppointment,
    selectServiceValetAppointment,
    selectSR,
    selectSRMultiple,
    setAppointmentFilters,
    setAppointmentWasChanged,
    setCustomerEnteredEmail,
    setCustomerLoadedData,
    setEditAppointment,
    setLoadedDateRange,
    setLoadedReducer,
    setOldAppointmentId,
    setProfileLoading,
    setSessionId, setSlotPodId, setSlotsLoading,
    setWaitListSettings
} from "./actions";
import {setPackage} from "../appointmentFrameReducer/actions";
import dayjs from "dayjs";

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

const initialState: TAppointmentState = {
    sessionId: "",
    updated: false,
    searchedDateRange: null,
    serviceRequests: [],
    customerLoadedData: null,
    customerEnteredEmail: "",
    appointmentId: null,
    selectedSR: [],
    search: "",
    personalInformation: blankPersonalInfo,
    reminders: blankReminders,
    privacy: blankPrivacy,
    appointment: null,
    serviceValetAppointment: null,
    appointmentSlots: [],
    isAppointmentSlotsLoading: false,
    serviceValetSlots: [],
    appointmentFilters: {
        offersOnly: false,
        waitTimeOnly: false
    },
    serviceCategories: [],
    allServiceCategories: [],
    isProfileLoading: false,
    dropOffSettings: null,
    appointmentWasChanged: false,
    waitListSettings: null,
    slotPodId: null,
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
    .addCase(handleSearch, (state, {payload}) => {
        return {...state, search: payload};
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
    .addCase(selectAppointment, (state, {payload}) => {
        return {...state, appointment: payload, slotPodId: payload ? state.slotPodId : null};
    })
    .addCase(setLoadedDateRange, (state, {payload}) => {
        return {...state, searchedDateRange: payload};
    })
    .addCase(getAppointmentSlots, (state, {payload}) => {
        let appointmentSlots = payload.map(sl => {
            const date = `${String(sl.date).split("T")[0]}T${sl.time}Z`;
            return {...sl, id: `${sl.date}|${sl.time}`, date: dayjs.utc(date)}
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
            return {
                ...state,
                customerLoadedData: payload,
                personalInformation: {
                    ...state.personalInformation,
                    fullName: `${payload.firstName} ${payload.lastName}`,
                    email: payload.emails?.length ? payload.emails[0] : state.customerEnteredEmail,
                    phoneNumber: payload.phoneNumbers?.length ? payload.phoneNumbers[0] : ""
                }
            };
        }
        return {
            ...state,
            customerLoadedData: payload
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
    .addCase(setProfileLoading, (state, {payload}) => {
        return {...state, isProfileLoading: payload};
    })
    .addCase(getServiceValetSlots, (state, {payload}) => {
        return {...state, serviceValetSlots: payload};
    })
    .addCase(selectServiceValetAppointment, (state, {payload}) => {
        return {...state, serviceValetAppointment: payload, slotPodId: payload ? state.slotPodId : null};
    })
    .addCase(getDropOffSettings, (state, {payload}) => {
        return {...state, dropOffSettings: payload};
    })
    .addCase(setAppointmentWasChanged, (state, {payload}) => {
        return {...state, appointmentWasChanged: payload};
    })
    .addCase(setWaitListSettings, (state, {payload}) => {
        return {...state, waitListSettings: payload};
    })
    .addCase(setSlotPodId, (state, {payload}) => {
        return {...state, slotPodId: payload};
    })
    .addCase(setSlotsLoading, (state, {payload}) => {
        return {...state, isAppointmentSlotsLoading: payload};
    })
);