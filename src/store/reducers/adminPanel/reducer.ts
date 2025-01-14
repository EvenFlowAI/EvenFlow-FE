import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import { setAllocationTab, setTimeDifferentiationTab, setVehicleServicesTab } from './actions';

const initialState: TState = {
  appointmentAllocationTab: '0',
  timeDifferentiationTab: '0',
  vehicleServicesTab: '0',
};

export const adminPanelReducer = createReducer(initialState, builder =>
  builder
    .addCase(setAllocationTab, (state, { payload }) => {
      return { ...state, appointmentAllocationTab: payload };
    })
    .addCase(setTimeDifferentiationTab, (state, { payload }) => {
      return { ...state, timeDifferentiationTab: payload };
    })
    .addCase(setVehicleServicesTab, (state, { payload }) => {
      return { ...state, vehicleServicesTab: payload };
    })
);
