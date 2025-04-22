import { createReducer } from '@reduxjs/toolkit';
import { IPersonalInformation, IPrivacy, IReminders, TAppointmentState } from './types';
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
  selectSRComments,
  selectSRMultiple,
  setAppointmentFilters,
  setAppointmentWasChanged,
  setCustomerEnteredEmail,
  setCustomerLoadedData,
  setEditAppointment,
  setLoadedReducer,
  setOldAppointmentId,
  setProfileLoading,
  setSessionId,
  setSlotPodId,
  setSlotsLoading,
  setSlotsSearchDate,
  setSlotsServiceTypeOptionId,
  setSlotsTransportationId,
  setTopAligning,
  setWaitListSettings,
  selectSRComment,
  setLoadedDateRange,
} from './actions';
import { setPackage } from '../appointmentFrameReducer/actions';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const blankPersonalInfo: IPersonalInformation = {
  fullName: '',
  email: '',
  phoneNumber: '',
};
const blankReminders: IReminders = {
  email: false,
  phone: false,
  sms: false,
};
const blankPrivacy: IPrivacy = {
  privacy: false,
  callback: false,
};

const initialState: TAppointmentState = {
  sessionId: '',
  updated: false,
  serviceRequests: [],
  searchedDateRange: null,
  customerLoadedData: null,
  customerEnteredEmail: '',
  appointmentId: null,
  selectedSR: [],
  selectedSRComments: {},
  search: '',
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
    waitTimeOnly: false,
  },
  serviceCategories: [],
  allServiceCategories: [],
  isProfileLoading: false,
  dropOffSettings: null,
  appointmentWasChanged: false,
  waitListSettings: null,
  slotPodId: null,
  isTopAligning: false,
  slotsServiceTypeOptionId: null,
  slotsTransportationId: null,
  slotsSearchedDate: null,
};

export const appointmentReducer = createReducer(initialState, builder =>
  builder
    .addCase(getServiceCenterProfile, (state, { payload }) => {
      return { ...state, scProfile: payload };
    })
    .addCase(setTopAligning, (state, { payload }) => {
      return { ...state, isTopAligning: payload };
    })
    .addCase(getSRs, (state, { payload }) => {
      return { ...state, serviceRequests: payload };
    })
    .addCase(selectSR, (state, { payload }) => {
      if (payload === null) {
        return { ...state, selectedSR: [] };
      }
      let selected = [...state.selectedSR];
      if (selected.includes(payload)) {
        selected = selected.filter(id => id !== payload);
      } else {
        selected = [...selected, payload];
      }
      return { ...state, selectedSR: selected };
    })
    .addCase(handleSearch, (state, { payload }) => {
      return { ...state, search: payload };
    })
    .addCase(changeReminders, (state, { payload }) => {
      return { ...state, reminders: { ...state.reminders, ...payload } };
    })
    .addCase(changePrivacy, (state, { payload }) => {
      return { ...state, privacy: { ...state.privacy, ...payload } };
    })
    .addCase(changePersonalInformation, (state, { payload }) => {
      return { ...state, personalInformation: { ...state.personalInformation, ...payload } };
    })
    .addCase(selectAppointment, (state, { payload }) => {
      return { ...state, appointment: payload };
    })
    // .addCase(setLoadedDateRange, (state, { payload }) => {
    //   return { ...state, searchedDateRange: payload };
    // })
    .addCase(getAppointmentSlots, (state, { payload }) => {
      let appointmentSlots = payload.map(sl => {
        const date = `${String(sl.date).split('T')[0]}T${sl.time}Z`;
        const uniqueId = uuidv4();
        return { ...sl, id: `${sl.date}|${sl.time}`, date: dayjs.utc(date), uniqueId };
      });

      return { ...state, appointmentSlots };
    })
    .addCase(setLoadedReducer, (state, { payload }) => {
      return { ...state, ...payload };
    })
    .addCase(setOldAppointmentId, (state, { payload: { updated, ...payload } }) => {
      return { ...state, appointmentId: payload, updated };
    })
    .addCase(setAppointmentFilters, (state, { payload }) => {
      return { ...state, appointmentFilters: { ...state.appointmentFilters, ...payload } };
    })
    .addCase(setCustomerEnteredEmail, (state, { payload }) => {
      return { ...state, customerEnteredEmail: payload };
    })
    .addCase(setCustomerLoadedData, (state, { payload }) => {
      if (payload) {
        return {
          ...state,
          customerLoadedData: payload,
          personalInformation: {
            ...state.personalInformation,
            fullName: `${payload.firstName} ${payload.lastName}`,
            email: payload.emails?.length ? payload.emails[0] : state.customerEnteredEmail,
            phoneNumber: payload.phoneNumbers?.length ? payload.phoneNumbers[0] : '',
          },
        };
      }
      return {
        ...state,
        customerLoadedData: payload,
      };
    })
    .addCase(setEditAppointment, (state, { payload }) => {
      return payload;
    })
    .addCase(setSessionId, (state, { payload }) => {
      if (state.customerLoadedData) {
        return {
          ...state,
          sessionId: payload,
          customerLoadedData: { ...state.customerLoadedData, sessionId: payload },
        };
      }
      return { ...state, sessionId: payload };
    })
    .addCase(setPackage, state => {
      return { ...state, appointment: null };
    })
    .addCase(getServiceCategories, (state, { payload }) => {
      return { ...state, serviceCategories: payload };
    })
    .addCase(getAllServiceCategories, (state, { payload }) => {
      return { ...state, allServiceCategories: payload };
    })
    .addCase(selectSRMultiple, (state, { payload }) => {
      return { ...state, selectedSR: payload.ids, selectedSRComments: payload.comments };
    })
    .addCase(selectSRComments, (state, { payload }) => {
      return { ...state, selectedSRComments: payload.comments };
    })
    .addCase(selectSRComment, (state, { payload }) => {
      return { ...state, selectedSRComments: { ...state.selectedSRComments, ...payload.comments } };
    })
    .addCase(setProfileLoading, (state, { payload }) => {
      return { ...state, isProfileLoading: payload };
    })
    .addCase(getServiceValetSlots, (state, { payload }) => {
      return { ...state, serviceValetSlots: payload };
    })
    .addCase(selectServiceValetAppointment, (state, { payload }) => {
      return { ...state, serviceValetAppointment: payload };
    })
    .addCase(getDropOffSettings, (state, { payload }) => {
      return { ...state, dropOffSettings: payload };
    })
    .addCase(setAppointmentWasChanged, (state, { payload }) => {
      return { ...state, appointmentWasChanged: payload };
    })
    .addCase(setWaitListSettings, (state, { payload }) => {
      return { ...state, waitListSettings: payload };
    })
    .addCase(setSlotPodId, (state, { payload }) => {
      return { ...state, slotPodId: payload };
    })
    .addCase(setSlotsLoading, (state, { payload }) => {
      return { ...state, isAppointmentSlotsLoading: payload };
    })
    .addCase(setSlotsServiceTypeOptionId, (state, { payload }) => {
      return { ...state, slotsServiceTypeOptionId: payload };
    })
    .addCase(setSlotsTransportationId, (state, { payload }) => {
      return { ...state, slotsTransportationId: payload };
    })
    .addCase(setSlotsSearchDate, (state, { payload }) => {
      return { ...state, slotsSearchedDate: payload };
    })
);
