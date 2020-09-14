import {IServiceRequest, IServiceRequestNonAddedFilter} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";
import {
    getNonSelectedServiceRequests,
    setLoadingNonSelected,
    setNonSelectedPageData,
    setNonSelectedPaging,
    setNonSelectedFilter
} from "./actions";

type TState = {
    nonSelectedList: IServiceRequest[];
    nonSelectedLoading: boolean;
    nonSelectedPaging: IPagingResponse;
    nonSelectedPageData: IPageRequest;
    nonSelectedFilter: IServiceRequestNonAddedFilter
}
const initialState: TState = {
    nonSelectedList: [],
    nonSelectedLoading: false,
    nonSelectedPaging: {...defaultPaging},
    nonSelectedPageData: {...defaultPageData},
    nonSelectedFilter: {searchTerm: ""}
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
)