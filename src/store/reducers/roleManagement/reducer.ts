import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import { getRoleUsers } from './actions';

const initialState: TState = {
  users: [],
};

export const roleManagementReducer = createReducer(initialState, builder =>
  builder.addCase(getRoleUsers, (state, { payload }) => {
    return { ...state, users: payload };
  })
);
