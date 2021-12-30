import {IListAppointment} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getAppointments, setAppointmentsCount, setAppointmentsLoading} from "./actions";

type TState = {
    appointments: IListAppointment[];
    count: number;
    isLoading: boolean;
}

const initialState: TState = {
    appointments: [],
    count: 0,
    isLoading: false,
}

export const appointmentsReducer = createReducer(initialState, builder => builder
    .addCase(getAppointments, (state, { payload}) => {
        return {...state, appointments: payload}
    })
    .addCase(setAppointmentsLoading, (state, { payload} ) => {
        return {...state, isLoading: payload}
    })
    .addCase(setAppointmentsCount, (state, { payload} ) => {
        return {...state, count: payload}
    })
)