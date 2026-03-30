import { createReducer } from '@reduxjs/toolkit';
import { TState } from './types';
import { defaultPaging } from '../constants';
import { setLoading, setPaging, setRecallsDatabase } from './actions';

const initialState: TState = {
  pagination: defaultPaging,
  isLoading: false,
  recallsDatabase: [],
};

export const recallDatabaseReducer = createReducer(initialState, builder =>
  builder
    .addCase(setPaging, (state, { payload }) => {
      return { ...state, pagination: payload };
    })
    .addCase(setLoading, (state, { payload }) => {
      return { ...state, isLoading: payload };
    })
    .addCase(setRecallsDatabase, (state, { payload }) => {
      return { ...state, recallsDatabase: payload };
    })
);
