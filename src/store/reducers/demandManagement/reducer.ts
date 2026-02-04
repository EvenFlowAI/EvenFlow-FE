import { TState } from './types';
import { createReducer } from '@reduxjs/toolkit';
import { getAvailability, getSettings, setLoading } from './actions';

const initialState: TState = {
  isLoading: false,
  settings: [],
  availability: [],
};

export const demandManagementReducer = createReducer(initialState, builder =>
  builder
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(getSettings, (state, { payload }) => {
      return { ...state, settings: payload };
    })
    .addCase(getAvailability, (state, { payload }) => {
      return {
        ...state,
        availability: payload.sort(
          (a, b) =>
            new Date(a.openAppointmentDate).getTime() - new Date(b.openAppointmentDate).getTime()
        ),
      };
    })
);
