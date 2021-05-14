import {IOffer} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";
import {
    getArchivedOffers,
    getOffers,
    setArchivedOffersLoading,
    setArchivedOffersPageData, setArchivedOffersPaging,
    setOffersLoading,
    setOffersPageData,
    setOffersPaging
} from "./actions";

type TState = {
    offersLoading: boolean;
    offersList: IOffer[],
    offersPaging: IPagingResponse;
    offersPageData: IPageRequest;
    archivedOffersLoading: boolean;
    archivedOffersList: IOffer[],
    archivedOffersPaging: IPagingResponse;
    archivedOffersPageData: IPageRequest;
}
const initialState: TState = {
    offersList: [],
    offersLoading: false,
    offersPaging: {...defaultPaging},
    offersPageData: {...defaultPageData},
    archivedOffersList: [],
    archivedOffersLoading: false,
    archivedOffersPaging: {...defaultPaging},
    archivedOffersPageData: {...defaultPageData},
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
    .addCase(getArchivedOffers, (state, {payload}) => {
        return {...state, archivedOffersList: payload};
    })
    .addCase(setArchivedOffersPageData, (state, {payload}) => {
        return {...state, archivedOffersPageData: {...state.offersPageData, ...payload}};
    })
    .addCase(setArchivedOffersPaging, (state, {payload}) => {
        return {...state, archivedOffersPaging: payload};
    })
    .addCase(setArchivedOffersLoading, (state, {payload}) => {
        return {...state, archivedOffersLoading: payload};
    })
);