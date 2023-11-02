import {IAppointment, IPackageAppointments} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {
    getAllAppointments,
    getAppointments, getPackageByVehicle, getAppointmentsPageData, getScheduler, getServiceBookList,
    setAllAppointmentsCount,
    setAppointmentsCount,
    setAppointmentsLoading, setAppointmentsModalLoading
} from "./actions";
import {TScheduler, TServiceBook} from "./types";
import {IPageRequest} from "../../../types/types";

type TState = {
    appointments: IAppointment[];
    count: number;
    allCount: number;
    isLoading: boolean;
    isModalLoading: boolean;
    allAppointments: IAppointment[];
    packages: IPackageAppointments[];
    serviceBookList: TServiceBook[];
    schedulerList: TScheduler[];
    pageData: IPageRequest,
}

const initialState: TState = {
    appointments: [],
    count: 0,
    allCount: 0,
    isLoading: false,
    isModalLoading: false,
    allAppointments: [],
    packages: [],
    serviceBookList: [],
    schedulerList: [],
    pageData: {
        pageIndex: 0,
        pageSize: 0,
    }
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
    .addCase(getServiceBookList, (state, { payload} ) => {
        return {...state, serviceBookList: payload}
    })
    .addCase(getScheduler, (state, { payload} ) => {
        return {...state, schedulerList: payload}
    })
    .addCase(getAppointmentsPageData, (state, { payload} ) => {
        return {...state, pageData: {...state.pageData, ...payload}}
    })
)