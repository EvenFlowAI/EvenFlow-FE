import { createReducer } from '@reduxjs/toolkit';
import {
  getAdvisorsList,
  getAllAppointments,
  getAppointments,
  getAppointmentsPageData,
  getCurrentAppointment,
  getPackageByVehicle,
  getScheduler,
  getServiceBookList,
  getTechnicians,
  setAllAppointmentsCount,
  setCurrentAppointmentLoading,
  setAppointmentsCount,
  setAppointmentsLoading,
  setAppointmentsModalLoading,
} from './actions';
import { TState } from './types';

const initialState: TState = {
  appointments: [],
  count: 0,
  allCount: 0,
  isLoading: true,
  isModalLoading: false,
  allAppointments: [],
  packages: [],
  serviceBookList: [],
  schedulerList: [],
  pageData: {
    pageIndex: 0,
    pageSize: 10,
  },
  serviceAdvisors: [],
  technicians: [],
  currentAppointment: null,
  isAppointmentLoading: false,
};

export const appointmentsReducer = createReducer(initialState, builder =>
  builder
    .addCase(getAppointments, (state, { payload }) => {
      return { ...state, appointments: payload };
    })
    .addCase(getAllAppointments, (state, { payload }) => {
      return { ...state, allAppointments: payload };
    })
    .addCase(setAppointmentsLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setAppointmentsCount, (state, { payload }) => {
      return { ...state, count: payload };
    })
    .addCase(setAllAppointmentsCount, (state, { payload }) => {
      return { ...state, allCount: payload };
    })
    .addCase(setAppointmentsModalLoading, (state, { payload }) => {
      return { ...state, isModalLoading: payload };
    })
    .addCase(getPackageByVehicle, (state, { payload }) => {
      return { ...state, packages: payload };
    })
    .addCase(getServiceBookList, (state, { payload }) => {
      return { ...state, serviceBookList: payload };
    })
    .addCase(getScheduler, (state, { payload }) => {
      return { ...state, schedulerList: payload };
    })
    .addCase(getAppointmentsPageData, (state, { payload }) => {
      return { ...state, pageData: { ...state.pageData, ...payload } };
    })
    .addCase(getAdvisorsList, (state, { payload }) => {
      return { ...state, serviceAdvisors: payload };
    })
    .addCase(getTechnicians, (state, { payload }) => {
      return { ...state, technicians: payload };
    })
    .addCase(getCurrentAppointment, (state, { payload }) => {
      return { ...state, currentAppointment: payload };
    })
    .addCase(setCurrentAppointmentLoading, (state, { payload }) => {
      return { ...state, isAppointmentLoading: payload };
    })
);
