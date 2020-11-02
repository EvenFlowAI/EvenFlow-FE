import {createAction} from "@reduxjs/toolkit";
import {EOfferStatus, IOffer, IOfferForm} from "./types";
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
                    status: EOfferStatus.None,
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

export const createOffer = (data: IOfferForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Offers.Create, {data});
    dispatch(loadOffers(data.serviceCenterId));
}
export const updateOffer = (data: IOfferForm): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Offers.Edit, {data, urlParams: {id: data?.id || 0}});
    dispatch(loadOffers(data.serviceCenterId));
}
export const removeOffer = (offer: IOffer): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Offers.ChangeStatus, {
        urlParams: {id: offer.id}, data: {status: EOfferStatus.Deleted}
    });
    dispatch(loadOffers(offer.serviceCenterId));
}
export const setArchiveOffer = (data: IOffer): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.Offers.ChangeStatus,
        {
            data: {
                status: data.status === EOfferStatus.Archived ? EOfferStatus.None : EOfferStatus.Archived
            },
            urlParams: {
                id: data.id
            }
        });
    dispatch(loadOffers(data.serviceCenterId));
}