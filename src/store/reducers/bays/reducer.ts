import {createReducer} from "@reduxjs/toolkit";
import {
    getAllBays,
    getFilteredBays,
    setAllPaging,
    setPaging,
    setAllLoading,
    loading,
    saving,
    setPageData,
    getBaysShort
} from "./actions";
import {IBay, IBayShort} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";

type TState = {
    allBays: IBay[],
    allLoading: boolean;
    allPaging: IPagingResponse;
    saving: boolean;
    loading: boolean;
    paging: IPagingResponse;
    pageData: IPageRequest;
    bays: IBay[];
    baysShort: IBayShort[]
}
const initialState: TState = {
    allBays: [],
    bays: [],
    allLoading: false,
    allPaging: {...defaultPaging},
    saving: false,
    loading: false,
    pageData: {...defaultPageData},
    paging: {...defaultPaging},
    baysShort: []
}

export const baysReducer = createReducer<TState>(initialState, builder => builder
    .addCase(getAllBays, (state, {payload}) => {
        return {...state, allBays: payload};
    })
    .addCase(getFilteredBays, (state, {payload}) => {
        return {...state, bays: payload};
    })
    .addCase(setPaging, (state, {payload}) => {
        return {...state, paging: payload};
    })
    .addCase(setAllPaging, (state, {payload}) => {
        return {...state, allPaging: payload};
    })
    .addCase(setAllLoading, (state, {payload}) => {
        return {...state, allLoading: payload};
    })
    .addCase(setPageData, (state, {payload}) => {
        return {...state, pageData: {...state.pageData, ...payload}};
    })
    .addCase(loading, (state, {payload}) => {
        return {...state, loading: payload};
    })
    .addCase(saving, (state, {payload}) => {
        return {...state, saving: payload};
    })
    .addCase(getBaysShort, (state, {payload}) => {
        return {...state, baysShort: payload};
    })
);