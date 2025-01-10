import { createAction } from "@reduxjs/toolkit";
import {
  AppThunk,
  IPageRequest,
  IPagingResponse,
  PaginatedAPIResponse,
} from "../../../types/types";
import { IBay, IBayForm, IBayShort } from "./types";
import { Api } from "../../../api/ApiEndpoints/ApiEndpoints";

export const getAllBays = createAction<IBay[]>("Bays/GetAllBays");
export const getFilteredBays = createAction<IBay[]>("Bays/GetFiltered");
export const setAllLoading = createAction<boolean>("Bays/AllLoading");
export const setAllPaging = createAction<IPagingResponse>("Bays/SetAllPaging");
export const setPageData =
  createAction<Partial<IPageRequest>>("Bays/SetPageData");
export const setPaging = createAction<IPagingResponse>("Bays/SetPaging");
export const saving = createAction<boolean>("Bays/Saving");
export const loading = createAction<boolean>("Bays/Loading");

export const loadBays =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    const { pageData } = getState().bays;
    dispatch(loading(true));
    try {
      const {
        data: { result, paging },
      } = await Api.call<PaginatedAPIResponse<IBay>>(
        Api.endpoints.Bays.GetAll,
        { data: { ...pageData, serviceCenterId } },
      );
      dispatch(setPaging(paging));
      dispatch(loading(false));
      dispatch(getFilteredBays(result));
    } catch (e) {
      dispatch(loading(false));
      console.log("load bays error", e);
    }
  };

export const createBay =
  (data: IBayForm): AppThunk =>
  async (dispatch) => {
    dispatch(saving(true));
    try {
      await Api.call(Api.endpoints.Bays.Create, { data });
      dispatch(saving(false));
      dispatch(loadBays(data.serviceCenterId));
    } catch (e) {
      dispatch(saving(false));
      console.log("create bay error", e);
    }
  };

export const updateBay =
  (data: IBayForm, id: number): AppThunk =>
  async (dispatch) => {
    dispatch(saving(true));
    try {
      await Api.call(Api.endpoints.Bays.Update, { data, urlParams: { id } });
      dispatch(saving(false));
      dispatch(loadBays(data.serviceCenterId));
    } catch (e) {
      dispatch(saving(false));
      console.log("update bay error", e);
    }
  };
export const removeBay =
  (data: IBay): AppThunk =>
  async (dispatch) => {
    try {
      await Api.call(Api.endpoints.Bays.Remove, { urlParams: { id: data.id } });
      dispatch(loadBays(data.serviceCenterId));
    } catch (err) {
      console.log("remove bay err", err);
    }
  };
export const getBaysShort = createAction<IBayShort[]>("Bays/Short");
export const loadBaysShort =
  (serviceCenterId: number): AppThunk =>
  async (dispatch) => {
    try {
      const {
        data: { result },
      } = await Api.call<PaginatedAPIResponse<IBayShort>>(
        Api.endpoints.Bays.GetShort,
        { data: { pageSize: 0, serviceCenterId } },
      );
      dispatch(getBaysShort(result));
    } catch (err) {
      console.log("get bay err", err);
    }
  };
