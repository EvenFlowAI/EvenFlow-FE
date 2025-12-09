import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import {
  setAllocationTab,
  setGlobalLoader,
  setLocalTab,
  setTimeDifferentiationTab,
  setVehicleServicesTab,
} from './actions';

const initialState: TState = {
  appointmentAllocationTab: '0',
  timeDifferentiationTab: '0',
  vehicleServicesTab: '0',
  localTab: '0',
  globalLoader: true,
};

export const adminPanelReducer = createReducer(initialState, builder =>
  builder
    .addCase(setAllocationTab, (state, { payload }) => {
      return { ...state, appointmentAllocationTab: payload };
    })
    .addCase(setLocalTab, (state, { payload }) => {
      return { ...state, localTab: payload };
    })
    .addCase(setTimeDifferentiationTab, (state, { payload }) => {
      return { ...state, timeDifferentiationTab: payload };
    })
    .addCase(setVehicleServicesTab, (state, { payload }) => {
      return { ...state, vehicleServicesTab: payload };
    })
    .addCase(setGlobalLoader, (state, { payload }) => {
      return { ...state, globalLoader: payload };
    })
);
