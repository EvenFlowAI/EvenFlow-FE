import {IAssignedServiceRequest, IServiceRequest, IServiceRequestNonAddedFilter} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";
import {
    getNonSelectedServiceRequests,
    setLoadingNonSelected,
    setNonSelectedPageData,
    setNonSelectedPaging,
    setNonSelectedFilter,
    getAssignedServiceRequests,
    setAssignedLoading,
    setAssignedPaging,
    setAssignedPageData,
    setAssignedFilter,
} from "./actions";

type TState = {
    nonSelectedList: IServiceRequest[];
    nonSelectedLoading: boolean;
    nonSelectedPaging: IPagingResponse;
    nonSelectedPageData: IPageRequest;
    nonSelectedFilter: IServiceRequestNonAddedFilter,
    assignedList: IAssignedServiceRequest[];
    assignedLoading: boolean;
    assignedPaging: IPagingResponse;
    assignedPageData: IPageRequest;
    assignedFilter: IServiceRequestNonAddedFilter
}
const initialState: TState = {
    nonSelectedList: [],
    nonSelectedLoading: false,
    nonSelectedPaging: {...defaultPaging},
    nonSelectedPageData: {...defaultPageData},
    nonSelectedFilter: {searchTerm: ""},
    assignedList: [],
    assignedLoading: false,
    assignedPaging: {...defaultPaging},
    assignedPageData: {...defaultPageData},
    assignedFilter: {searchTerm: ""}
};

export const serviceRequestsReducer = createReducer(
    initialState, builder => builder
        .addCase(getNonSelectedServiceRequests, (state, {payload}) => {
            return {...state, nonSelectedList: payload};
        })
        .addCase(setLoadingNonSelected, (state, {payload}) => {
            return {...state, nonSelectedLoading: payload};
        })
        .addCase(setNonSelectedPaging, (state, {payload}) => {
            return {...state, nonSelectedPaging: payload};
        })
        .addCase(setNonSelectedPageData, (state, {payload}) => {
            return {...state, nonSelectedPageData: {...state.nonSelectedPageData, ...payload}};
        })
        .addCase(setNonSelectedFilter, (state, {payload}) => {
            return {...state, nonSelectedFilter: {...state.nonSelectedFilter, ...payload}};
        })
        .addCase(getAssignedServiceRequests, (state, {payload}) => {
            return {...state, assignedList: payload};
        })
        .addCase(setAssignedLoading, (state, {payload}) => {
            return {...state, assignedLoading: payload};
        })
        .addCase(setAssignedPaging, (state, {payload}) => {
            return {...state, assignedPaging: payload};
        })
        .addCase(setAssignedPageData, (state, {payload}) => {
            return {...state, assignedPageData: {...state.assignedPageData, ...payload}};
        })
        .addCase(setAssignedFilter, (state, {payload}) => {
            return {...state, assignedFilter: {...state.assignedFilter, ...payload}};
        })
)