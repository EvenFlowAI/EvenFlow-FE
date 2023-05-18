import {createReducer} from "@reduxjs/toolkit";
import {ICustomerByName, IRepairHistory} from "./types";
import {getCustomers, getRepairHistory, setCurrentCustomer, setLoading, setPageData, setPaging} from "./actions";
import {IPageRequest, IPagingResponse} from "../../../types/types";

type TCustomerSearchState = {
    isLoading: boolean;
    customers: ICustomerByName[];
    currentCustomer: ICustomerByName|null;
    paging: IPagingResponse;
    pageData: IPageRequest;
    repairHistory: IRepairHistory|null;
}
const initialState: TCustomerSearchState = {
    isLoading: false,
    customers: [],
    currentCustomer: null,
    paging: {numberOfPages: 0, numberOfRecords: 0},
    pageData: {pageIndex: 0, pageSize: 10},
    repairHistory: null,
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
)