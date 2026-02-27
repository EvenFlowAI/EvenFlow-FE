import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import { getRoleUsers, setLoading } from './actions';

const initialState: TState = {
  users: [],
  isLoading: false,
};

export const roleManagementReducer = createReducer(initialState, builder =>
  builder
    .addCase(getRoleUsers, (state, { payload }) => {
      return { ...state, users: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
);
