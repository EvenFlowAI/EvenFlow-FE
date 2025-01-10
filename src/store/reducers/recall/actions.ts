import { createAction } from "@reduxjs/toolkit";
import {
  ICreateUpdateRecall,
  IRecall,
  IRecallResponse,
  TRecallRequest,
  TUpdateRecall,
} from "./types";
import {
  AppThunk,
  IOrder,
  IPageRequest,
  IRecallByVin,
  TArgCallback,
  TCallback,
} from "../../../types/types";
import { setSelectedRecalls } from "../appointmentFrameReducer/actions";
import { Api } from "../../../api/ApiEndpoints/ApiEndpoints";

export const getRecalls = createAction<IRecall[]>("Recall/GetRecalls");
export const setLoading = createAction<boolean>("Recall/SetLoading");
export const setRecallPageData = createAction<Partial<IPageRequest>>(
  "Recall/SetRecallPageData",
);
export const setRecallsCount = createAction<number>("Recall/SetRecallsCount");
export const getRecallsByVin = createAction<IRecallByVin[]>(
  "Recall/GetRecallsByVin",
);
export const setRecallOrder = createAction<IOrder<IRecall>>("Recall/SetOrder");
export const setRecallSearch = createAction<string>("Recall/SetSearch");

export const loadRecalls =
  (serviceCenterId: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(setLoading(true));
    const { recallPageData, order, searchTerm } = getState().recalls;
    const { pageSize, pageIndex } = recallPageData;
    const data: TRecallRequest = {
      serviceCenterId,
      pageSize,
      pageIndex,
      searchTerm,
    };
    if (order) {
      data.orderBy = order.orderBy;
      data.isAscending = order.isAscending;
    }
    Api.call<IRecallResponse>(Api.endpoints.Recalls.GetAll, { data })
      .then((result) => {
        if (result.data?.result) {
          dispatch(
            getRecalls(
              result.data.result.map((el, index) => ({
                ...el,
                localIndex: index,
              })),
            ),
          );
          dispatch(setRecallsCount(result.data.paging.numberOfRecords));
        }
      })
      .catch((err) => {
        console.log("get recalls err", err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const createRecall =
  (
    data: ICreateUpdateRecall,
    onError: (err: string) => void,
    onSuccess: () => void,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Create, { data })
      .then((result) => {
        if (result) {
          dispatch(loadRecalls(data.serviceCenterId));
          onSuccess();
        }
      })
      .catch((err) => {
        console.log("create recall err", err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const updateRecall =
  (
    data: ICreateUpdateRecall,
    id: number,
    onError: (err: string) => void,
    onSuccess: () => void,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Update, { urlParams: { id }, data })
      .then((result) => {
        if (result) {
          dispatch(loadRecalls(data.serviceCenterId));
          onSuccess();
        }
      })
      .catch((err) => {
        console.log("update recall err", err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const deleteRecall =
  (
    id: number,
    serviceCenterId: number,
    onError: (err: string) => void,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Remove, {
      urlParams: { id },
      params: { serviceCenterId },
    })
      .then((result) => {
        if (result) dispatch(loadRecalls(serviceCenterId));
      })
      .catch((err) => {
        console.log("delete recall err", err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const loadRecallsByVin =
  (
    serviceCenterId: number,
    vin: string,
    make: string,
    model: string,
    year: number,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.GetByVin, {
      data: { serviceCenterId, vin: vin.toUpperCase(), make, model, year },
    })
      .then((result) => {
        if (result.data) dispatch(getRecallsByVin(result.data));
      })
      .catch((err) => {
        console.log("get recalls by vin err", err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateSelectedRecalls =
  (
    serviceCenterId: number,
    vin: string,
    make: string,
    model: string,
    year: number,
    recallsNumbers: string[],
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.GetByVin, {
      data: { serviceCenterId, vin: vin.toUpperCase(), make, model, year },
    })
      .then((result) => {
        if (result.data) {
          const data: IRecallByVin[] = result.data;
          dispatch(getRecallsByVin(data));
          const selected = data.filter((item) => {
            return item.campaignNumber
              ? recallsNumbers.includes(item.campaignNumber)
              : item.oemProgram && recallsNumbers.includes(item.oemProgram);
          });
          dispatch(setSelectedRecalls(selected));
        }
      })
      .catch((err) => {
        console.log("set update selected recalls err", err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updatePartsAvailability =
  (
    serviceCenterId: number,
    data: TUpdateRecall[],
    onError: TArgCallback<any>,
    onSuccess: TCallback,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.UpdateRecallParts, {
      data: { serviceCenterId, recallParts: data },
    })
      .then((res) => {
        if (res) dispatch(loadRecalls(serviceCenterId));
        onSuccess();
      })
      .catch((err) => {
        onError(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };
