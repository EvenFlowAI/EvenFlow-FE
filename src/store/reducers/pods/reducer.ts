import {IPod, IPodFilters} from "./types";
import {
    getPods,
    setPodsLoading,
    setPodsPageData,
    setPodsPaging,
    setPodsFilters
} from "./actions";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";

type TState = {
    podsList: IPod[],
    podsLoading: boolean;
    podsPaging: IPagingResponse;
    podsPageData: IPageRequest;
    podsFilters: IPodFilters;
}
const initialState: TState = {
    podsList: [],
    podsLoading: false,
    podsPaging: {...defaultPaging},
    podsPageData: {...defaultPageData},
    podsFilters: {
        searchTerm: "",
        advisorId: ""
    }
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
)