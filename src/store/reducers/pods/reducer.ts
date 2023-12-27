import {TState} from "./types";
import {
    getPods,
    getPodsShort,
    setPodsFilters,
    setPodsLoading,
    setPodsPageData,
    setPodsPaging,
    setSelectedPod
} from "./actions";
import {defaultPageData, defaultPaging} from "../constants";
import {createReducer} from "@reduxjs/toolkit";

const initialState: TState = {
    podsList: [],
    podsLoading: false,
    podsPaging: {...defaultPaging},
    podsPageData: {...defaultPageData},
    podsFilters: {
        searchTerm: "",
        advisorId: ""
    },
    selectedPod: null,
    shortPodsList: [],
}

export const podsReducer = createReducer(initialState, builder => builder
    .addCase(getPods, (state, {payload}) => {
        return {...state, podsList: payload};
    })
    .addCase(setPodsLoading, (state, {payload}) => {
        return {...state, podsLoading: payload};
    })
    .addCase(setPodsPageData, (state, {payload}) => {
        return {...state, podsPageData: {...state.podsPageData, ...payload}};
    })
    .addCase(setPodsPaging, (state, {payload}) => {
        return {...state, podsPaging: payload};
    })
    .addCase(setPodsFilters, (state, {payload}) => {
        return {...state, podsFilters: {...state.podsFilters, ...payload}};
    })
    .addCase(getPodsShort, (state, {payload}) => {
        return {...state, shortPodsList: payload};
    })
    .addCase(setSelectedPod, (state, {payload}) => {
        return {...state, selectedPod: payload};
    })
)