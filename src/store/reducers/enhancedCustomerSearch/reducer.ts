import {createReducer} from "@reduxjs/toolkit";
import {ICustomerWithPhones, IRepairHistory, TCustomerSearchData} from "./types";
import {
    getCustomers,
    getRepairHistory,
    setCurrentCustomer, setCustomerSearchData,
    setLoading,
    setPageData,
    setPaging,
    setRepairHistoryLoading, setRepairHistoryPaging
} from "./actions";
import {IPageRequest, IPagingResponse} from "../../../types/types";

export const initialCustomerSearch: TCustomerSearchData = {
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    lastVINCharacters: ''
}

type TCustomerSearchState = {
    isLoading: boolean;
    customers: ICustomerWithPhones[];
    currentCustomer: ICustomerWithPhones|null;
    paging: IPagingResponse;
    pageData: IPageRequest;
    repairHistory: IRepairHistory|null;
    repairHistoryPaging: IPagingResponse;
    repairHistoryLoading: boolean;
    customerSearchData: TCustomerSearchData;
}
const initialState: TCustomerSearchState = {
    isLoading: false,
    customers: [],
    currentCustomer: null,
    paging: {numberOfPages: 0, numberOfRecords: 0},
    pageData: {pageIndex: 0, pageSize: 10},
    repairHistoryPaging: {numberOfPages: 0, numberOfRecords: 0},
    repairHistory: null,
    repairHistoryLoading: false,
    customerSearchData: initialCustomerSearch,
}

export const customerReducer = createReducer(initialState, builder => builder
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(getCustomers, (state, {payload}) => {
        return {...state, customers: payload}
    })
    .addCase(setCurrentCustomer, (state, {payload}) => {
        return {...state, currentCustomer: payload}
    })
    .addCase(setPageData, (state, {payload}) => {
        return {...state, pageData: {...state.pageData, ...payload}}
    })
    .addCase(setPaging, (state, {payload}) => {
        return {...state, paging: payload}
    })
    .addCase(getRepairHistory, (state, {payload}) => {
        return {...state, repairHistory: payload}
    })
    .addCase(setRepairHistoryLoading, (state, {payload}) => {
        return {...state, repairHistoryLoading: payload}
    })
    .addCase(setRepairHistoryPaging, (state, {payload}) => {
        return {...state, repairHistoryPaging: payload}
    })
    .addCase(setCustomerSearchData, (state, {payload}) => {
        if (!payload) return {...state, customerSearchData: initialCustomerSearch}
        return {...state, customerSearchData: {...state.customerSearchData, ...payload}}
    })
)