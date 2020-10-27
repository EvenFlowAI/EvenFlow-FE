import {createAction} from "@reduxjs/toolkit";
import {IOffer} from "./types";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getOffers = createAction<IOffer[]>("Offers/GetOffers");
export const setOffersPageData = createAction<Partial<IPageRequest>>("Offers/PageData");
export const setOffersPaging = createAction<IPagingResponse>("Offers/Paging");
export const setOffersLoading = createAction<boolean>("Offers/Loading");

export const loadOffers = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    dispatch(setOffersLoading(true));
    try {
        const pageData = getState().offers.offersPageData
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IOffer>>(
            Api.endpoints.Offers.GetAll,
            {
                data: {
                    serviceCenterId,
                    ...pageData
                }
            }
        );
        dispatch(getOffers(result));
        dispatch(setOffersPaging(paging));
    } finally {
        dispatch(setOffersLoading(false));
    }
}