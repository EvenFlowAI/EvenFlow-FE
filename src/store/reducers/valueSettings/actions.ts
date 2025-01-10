import { createAction } from "@reduxjs/toolkit";
import {
  ICustomerLifetime,
  ICustomerLifetimeForm,
  IEndOfWarranty,
  INewLostCustomer,
  IValueSettings,
  IValueSettingsResponse,
} from "./types";
import { AppThunk } from "../../../types/types";

import { Api } from "../../../api/ApiEndpoints/ApiEndpoints";

export const getCustomerLifetimes = createAction<ICustomerLifetime | undefined>(
  "Value/SetLifetime",
);
export const getNewLostCustomers = createAction<INewLostCustomer[]>(
  "Value/NewLostCustomer",
);
export const getEndOfWarranty = createAction<IEndOfWarranty | undefined>(
  "Value/EndOfWarrantyModal",
);
export const getValueSettings =
  createAction<IValueSettings[]>("Value/Settings");
export const getConfiguredValues = createAction<number[]>(
  "Value/ConfiguredValues",
);
export const loadCustomerLifetimes =
  (serviceCenterId: number, podId?: number): AppThunk =>
  async (dispatch) => {
    try {
      const { data } = await Api.call<ICustomerLifetime>(
        Api.endpoints.ValueSettings.GetCL,
        { params: { serviceCenterId, podId } },
      );
      dispatch(getCustomerLifetimes(data));
    } catch (e: any) {
      if (e.response?.status === 400) {
        dispatch(getCustomerLifetimes(undefined));
      } else {
        console.log("updateUser", e);
      }
    }
  };
export const setCustomerLifetimes =
  (data: ICustomerLifetimeForm): AppThunk =>
  async (dispatch) => {
    try {
      await Api.call(Api.endpoints.ValueSettings.SetCL, { data });
      dispatch(loadCustomerLifetimes(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log(err);
    }
  };

export const loadNewLostCustomers =
  (serviceCenterId: number, podId?: number): AppThunk =>
  async (dispatch) => {
    try {
      const { data } = await Api.call<INewLostCustomer[]>(
        Api.endpoints.ValueSettings.GetCTS,
        { params: { serviceCenterId, podId } },
      );
      dispatch(getNewLostCustomers(data));
    } catch (e: any) {
      if (e?.response?.status === 400) {
        dispatch(getNewLostCustomers([]));
      } else {
        console.log("loadNewLostCustomers", e);
      }
    }
  };
export const setNewLostCustomers =
  (data: INewLostCustomer): AppThunk =>
  async (dispatch) => {
    try {
      await Api.call(Api.endpoints.ValueSettings.SetCTS, { data });
      dispatch(loadNewLostCustomers(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log(err);
    }
  };

export const loadEndOfWarranty =
  (serviceCenterId: number, podId?: number): AppThunk =>
  async (dispatch) => {
    try {
      const { data } = await Api.call<IEndOfWarranty[]>(
        Api.endpoints.ValueSettings.GetWS,
        { params: { serviceCenterId, podId } },
      );
      dispatch(getEndOfWarranty(data[0]));
    } catch (e: any) {
      if (e?.response?.status === 400) {
        dispatch(getEndOfWarranty(undefined));
      } else {
        console.log("loadEndOfWarranty", e);
      }
    }
  };
export const setEndOfWarranty =
  (data: IEndOfWarranty): AppThunk =>
  async (dispatch) => {
    try {
      await Api.call(Api.endpoints.ValueSettings.SetWS, { data });
      dispatch(loadEndOfWarranty(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log(err);
    }
  };

export const loadValueSettings =
  (serviceCenterId: number, podId?: number): AppThunk =>
  async (dispatch) => {
    try {
      const { data } = await Api.call<IValueSettingsResponse>(
        Api.endpoints.ValueSettings.GetValue,
        { params: { serviceCenterId, podId } },
      );
      dispatch(getValueSettings(data.items));
      dispatch(getConfiguredValues(data.leversToConfiguration));
    } catch (err) {
      console.log(err);
    }
  };
export const setValueSettings =
  (data: IValueSettings): AppThunk =>
  async (dispatch) => {
    try {
      await Api.call(Api.endpoints.ValueSettings.SetValue, { data });
      await dispatch(loadValueSettings(data.serviceCenterId, data.podId));
    } catch (err) {
      console.log(err);
    }
  };
