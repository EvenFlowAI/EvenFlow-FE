import {IMake, IPackageById, IPackageByQuery} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {
    getComplimentary,
    getMakes,
    getPackageById,
    getPackagesByQuery,
    setComplimentaryLoading,
    setComplimentaryPageData,
    setComplimentaryPagingResponse, setComplimentarySearchTerm, setComplimentarySort,
    setPackageLoading
} from "./actions";
import {IComplimentaryServiceByQuery} from "./types";
import {IOrder, IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultOrder} from "../../../config/config";

type TState = {
    currentPackage: IPackageById | null;
    isPackageLoading: boolean;
    packages: IPackageByQuery[] | [];
    makes: IMake[];
    complimentary: IComplimentaryServiceByQuery[];
    isComplimentaryLoading: boolean;
    complimentaryPaging: IPagingResponse;
    complimentaryPageData: IPageRequest;
    complimentarySortOrder: IOrder<IComplimentaryServiceByQuery>;
    complimentarySearchTerm: string;
}

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
    complimentaryPageData: {
        pageIndex: 0,
        pageSize: 0,
    },
    complimentarySortOrder: {...defaultOrder},
    complimentarySearchTerm: '',
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
        return {...state, complimentaryPageData: {...state.complimentaryPageData, payload}}
    })
    .addCase(setComplimentarySort, (state, { payload }) => {
        return {...state, complimentarySortOrder: payload}
    })
    .addCase(setComplimentarySearchTerm, (state, { payload }) => {
        return {...state, complimentarySearchTerm: payload}
    })
);