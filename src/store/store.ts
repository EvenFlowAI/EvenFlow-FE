import { configureStore } from '@reduxjs/toolkit';
import ThunkMiddleware from 'redux-thunk';
import { rootReducer } from './rootReducer';
import { useDispatch } from 'react-redux';

const env = process.env.REACT_APP_ENV;

export const store = configureStore({
  reducer: rootReducer,
  devTools: env !== 'production',
  middleware: [ThunkMiddleware],
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
