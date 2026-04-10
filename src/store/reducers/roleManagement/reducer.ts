import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import { getRoleUsers, setDmsIdError, setEmailError, setLoading } from './actions';

const initialState: TState = {
  users: [],
  isLoading: false,
  dmsIdError: false,
  emailError: false,
};

export const roleManagementReducer = createReducer(initialState, builder =>
  builder
    .addCase(getRoleUsers, (state, { payload }) => {
      return { ...state, users: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setDmsIdError, (state, { payload }) => {
      return { ...state, dmsIdError: payload };
    })
    .addCase(setEmailError, (state, { payload }) => {
      return { ...state, emailError: payload };
    })
);
