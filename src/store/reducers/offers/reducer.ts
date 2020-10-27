import {IOffer} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";
import {getOffers, setOffersLoading, setOffersPageData, setOffersPaging} from "./actions";

type TState = {
    offersLoading: boolean;
    offersList: IOffer[],
    offersPaging: IPagingResponse;
    offersPageData: IPageRequest;
}
const initialState: TState = {
    offersList: [],
    offersLoading: false,
    offersPaging: {...defaultPaging},
    offersPageData: {...defaultPageData},
}
export const offersReducer = createReducer(initialState, builder => builder
    .addCase(getOffers, (state, {payload}) => {
        return {...state, offersList: payload};
    })
    .addCase(setOffersPageData, (state, {payload}) => {
        return {...state, offersPageData: {...state.offersPageData, ...payload}};
    })
    .addCase(setOffersPaging, (state, {payload}) => {
        return {...state, offersPaging: payload};
    })
    .addCase(setOffersLoading, (state, {payload}) => {
        return {...state, offersLoading: payload};
    })
);