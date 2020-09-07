import {createReducer} from "@reduxjs/toolkit";
import {getAllBays, getFilteredBays, setAllPaging, setPaging, setAllLoading, loading, saving, setPageData} from "./actions";
import {IBay} from "./types";
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
}
const initialState: TState = {
    allBays: [],
    bays: [],
    allLoading: false,
    allPaging: {...defaultPaging},
    saving: false,
    loading: false,
    pageData: {...defaultPageData},
    paging: {...defaultPaging}
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
);