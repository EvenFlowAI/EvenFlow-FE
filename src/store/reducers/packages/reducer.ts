import {createReducer} from "@reduxjs/toolkit";
import {
    getAllComplimentary,
    getComplimentary,
    getMakes,
    getPackageById,
    getPackagesByQuery,
    setComplimentaryLoading,
    setComplimentaryPageData,
    setComplimentaryPagingResponse,
    setComplimentarySearchTerm,
    setComplimentarySort,
    setPackageLoading
} from "./actions";
import {TState} from "./types";
import {defaultOrder} from "../../../config/config";
import {defaultPageData} from "../constants";

const initialState: TState = {
    currentPackage: null,
    isPackageLoading: false,
    packages: [],
    makes: [],
    complimentary: [],
    isComplimentaryLoading: false,
    complimentaryPaging: {
        numberOfPages: 0,
        numberOfRecords: 0,
    },
    complimentaryPageData: {...defaultPageData},
    complimentarySortOrder: {...defaultOrder},
    complimentarySearchTerm: '',
    allComplimentary: [],
}

export const packagesReducer = createReducer(initialState, builder => builder
    .addCase(getPackageById, (state, { payload }) => {
        return { ...state, currentPackage: payload}
    })
    .addCase(setPackageLoading, (state, { payload }) => {
        return { ...state, isPackageLoading: payload}
    })
    .addCase(getPackagesByQuery, (state, { payload }) => {
        return { ...state, packages: payload}
    })
    .addCase(getMakes, (state, { payload }) => {
        return { ...state, makes: payload}
    })
    .addCase(getComplimentary, (state, { payload }) => {
        return {...state, complimentary: payload}
    })
    .addCase(setComplimentaryLoading, (state, { payload}) => {
        return {...state, isComplimentaryLoading: payload}
    })
    .addCase(setComplimentaryPagingResponse, (state, { payload}) => {
        return {...state, complimentaryPaging: payload}
    })
    .addCase(setComplimentaryPageData, (state, { payload}) => {
        return {...state, complimentaryPageData: {...state.complimentaryPageData, ...payload }}
    })
    .addCase(setComplimentarySort, (state, { payload }) => {
        return {...state, complimentarySortOrder: payload}
    })
    .addCase(setComplimentarySearchTerm, (state, { payload }) => {
        return {...state, complimentarySearchTerm: payload}
    })
    .addCase(getAllComplimentary, (state, { payload }) => {
        return {...state, allComplimentary: payload}
    })
);