import {createReducer} from "@reduxjs/toolkit";
import {ICustomerByName} from "./types";
import {getCustomers, setCurrentCustomer, setLoading, setPageData, setPaging} from "./actions";
import {IPageRequest, IPagingResponse} from "../../../types/types";

type TCustomerSearchState = {
    isLoading: boolean;
    customers: ICustomerByName[];
    currentCustomer: ICustomerByName|null;
    paging: IPagingResponse;
    pageData: IPageRequest;
}
const initialState: TCustomerSearchState = {
    isLoading: false,
    customers: [],
    currentCustomer: null,
    paging: {numberOfPages: 0, numberOfRecords: 0},
    pageData: {pageIndex: 0, pageSize: 10},
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
)