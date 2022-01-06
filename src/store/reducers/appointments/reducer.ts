import {IListAppointment} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {
    getAllAppointments,
    getAppointments,
    setAllAppointmentsCount,
    setAppointmentsCount,
    setAppointmentsLoading, setAppointmentsModalLoading
} from "./actions";

type TState = {
    appointments: IListAppointment[];
    count: number;
    allCount: number;
    isLoading: boolean;
    isModalLoading: boolean;
    allAppointments: IListAppointment[];
}

const initialState: TState = {
    appointments: [],
    count: 0,
    allCount: 0,
    isLoading: false,
    isModalLoading: false,
    allAppointments: [],
}

export const appointmentsReducer = createReducer(initialState, builder => builder
    .addCase(getAppointments, (state, { payload}) => {
        return {...state, appointments: payload}
    })
    .addCase(getAllAppointments, (state, { payload}) => {
        return {...state, allAppointments: payload}
    })
    .addCase(setAppointmentsLoading, (state, { payload} ) => {
        return {...state, isLoading: payload}
    })
    .addCase(setAppointmentsCount, (state, { payload} ) => {
        return {...state, count: payload}
    })
    .addCase(setAllAppointmentsCount, (state, { payload} ) => {
        return {...state, allCount: payload}
    })
    .addCase(setAppointmentsModalLoading, (state, { payload} ) => {
        return {...state, isModalLoading: payload}
    })
)