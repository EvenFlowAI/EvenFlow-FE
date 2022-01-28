import {IAppointmentByQuery, IPackageAppointments} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {
    getAllAppointments,
    getAppointments, getPackageByVehicle,
    setAllAppointmentsCount,
    setAppointmentsCount,
    setAppointmentsLoading, setAppointmentsModalLoading
} from "./actions";

type TState = {
    appointments: IAppointmentByQuery[];
    count: number;
    allCount: number;
    isLoading: boolean;
    isModalLoading: boolean;
    allAppointments: IAppointmentByQuery[];
    packages: IPackageAppointments[];
}

const initialState: TState = {
    appointments: [],
    count: 0,
    allCount: 0,
    isLoading: false,
    isModalLoading: false,
    allAppointments: [],
    packages: [],
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
    .addCase(getPackageByVehicle, (state, { payload} ) => {
        return {...state, packages: payload}
    })
)