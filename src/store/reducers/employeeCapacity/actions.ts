import { AppThunk, TArgCallback, TCallback } from "../../../types/types";
import { Api } from "../../../api/ApiEndpoints/ApiEndpoints";
import { createAction } from "@reduxjs/toolkit";
import {
  ECapacityType,
  IAdvisorCapacity,
  ITechnicianCapacity,
  ITechniciansPayload,
  TAdvisorCapacityPayload,
  TCapacityDateRange,
  TTechniciansResponse,
} from "./types";

export const setLoading = createAction<boolean>("EmployeeCapacity/SetLoading");
export const setSettingLoading = createAction<boolean>(
  "EmployeeCapacity/SetSettingLoading",
);
export const getAdvisorsCapacity = createAction<IAdvisorCapacity[]>(
  "EmployeeCapacity/GetAdvisorsCapacity",
);
export const getTechniciansCapacity = createAction<ITechnicianCapacity[]>(
  "EmployeeCapacity/GetTechniciansCapacity",
);
export const getCapacityTypeOption = createAction<ECapacityType | null>(
  "EmployeeCapacity/GetCapacityTypeOption",
);
export const setDateRange = createAction<TCapacityDateRange>(
  "EmployeeCapacity?SetCapacityDateRange",
);

export const loadAdvisorsCapacity =
  (serviceCenterId: number): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call<IAdvisorCapacity[]>(
      Api.endpoints.EmployeeCapacity.GetAdvisorsCapacity,
      { params: { serviceCenterId } },
    )
      .then((res) => {
        if (res.data) dispatch(getAdvisorsCapacity(res.data));
      })
      .catch((err) => {
        console.log("get advisors capacity error", err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const loadTechniciansCapacity =
  (serviceCenterId: number, capacityType: ECapacityType): AppThunk =>
  (dispatch, getState) => {
    dispatch(setLoading(true));
    const { to, from } = getState().employeesCapacity.dateRange;
    Api.call<TTechniciansResponse>(
      Api.endpoints.EmployeeCapacity.GetTechniciansCapacity,
      { params: { serviceCenterId, dateTo: to, dateFrom: from, capacityType } },
    )
      .then((res) => {
        if (res.data) {
          dispatch(
            getTechniciansCapacity(
              res.data.technicianCapacitySettings.map((el, index) => ({
                ...el,
                localId: index + 1,
              })),
            ),
          );
          dispatch(getCapacityTypeOption(res.data.capacityTypeOption));
        }
      })
      .catch((err) => {
        console.log("get advisors capacity error", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
        dispatch(setSettingLoading(false));
      });
  };

export const updateAdvisorsCapacity =
  (
    data: TAdvisorCapacityPayload,
    onError: TArgCallback<any>,
    onSuccess?: TCallback,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.EmployeeCapacity.UpdateAdvisorsCapacity, { data })
      .then((res) => {
        if (res) {
          dispatch(loadAdvisorsCapacity(data.serviceCenterId));
          onSuccess && onSuccess();
        }
      })
      .catch((err) => {
        console.log("update advisors capacity error", err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const updateTechniciansCapacity =
  (
    data: ITechniciansPayload,
    capacityType: ECapacityType,
    onError: TArgCallback<any>,
    onSuccess?: TCallback,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.EmployeeCapacity.UpdateTechniciansCapacity, { data })
      .then((res) => {
        if (res) {
          dispatch(loadTechniciansCapacity(data.serviceCenterId, capacityType));
          onSuccess && onSuccess();
        }
      })
      .catch((err) => {
        console.log("update technicians capacity error", err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const updateTechniciansCapacityType =
  (
    serviceCenterId: number,
    type: ECapacityType,
    tab: ECapacityType,
    onError: TArgCallback<any>,
    onSuccess?: TCallback,
  ): AppThunk =>
  (dispatch) => {
    dispatch(setSettingLoading(true));
    Api.call(Api.endpoints.EmployeeCapacity.UpdateTechniciansSettings, {
      data: { serviceCenterId, type },
    })
      .then((res) => {
        if (res) {
          dispatch(loadTechniciansCapacity(serviceCenterId, tab));
          onSuccess && onSuccess();
        }
      })
      .catch((err) => {
        console.log("update technicians settings error", err);
        onError(err);
        dispatch(setSettingLoading(false));
      });
  };
