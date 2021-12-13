import {configureStore} from "@reduxjs/toolkit";
import ThunkMiddleware from "redux-thunk";
import {rootReducer} from "./rootReducer";
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: rootReducer,
    middleware: [ThunkMiddleware]
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();