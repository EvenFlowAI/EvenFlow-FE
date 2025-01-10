import { createReducer } from "@reduxjs/toolkit";
import {
  setCurrentZone,
  setLoading,
  setPricingOptionLoading,
  setServiceValetPrisingByDistance,
  setServiceValetPrisingByZones,
  setServiceValetPrisingOption,
  setSVZonesShort,
  setZones,
} from "./actions";
import { EAncillaryPriceType } from "../mobileService/types";
import { TState } from "./types";

const initialState: TState = {
  isLoading: false,
  currentZone: null,
  zones: [],
  pricingByZones: [],
  pricingByDistance: [],
  isPricingByZoneLoading: false,
  ancillaryPriceType: EAncillaryPriceType.Zone,
  svZonesShort: [],
};

export const serviceValetReducer = createReducer<TState>(
  initialState,
  (builder) =>
    builder
      .addCase(setCurrentZone, (state, { payload }) => {
        return { ...state, currentZone: payload };
      })
      .addCase(setLoading, (state, { payload }) => {
        return { ...state, isLoading: payload };
      })
      .addCase(setZones, (state, { payload }) => {
        return { ...state, zones: payload };
      })
      .addCase(setServiceValetPrisingByZones, (state, { payload }) => {
        return { ...state, pricingByZones: payload };
      })
      .addCase(setServiceValetPrisingByDistance, (state, { payload }) => {
        return { ...state, pricingByDistance: payload };
      })
      .addCase(setServiceValetPrisingOption, (state, { payload }) => {
        return { ...state, ancillaryPriceType: payload };
      })
      .addCase(setPricingOptionLoading, (state, { payload }) => {
        return { ...state, isPricingByZoneLoading: payload };
      })
      .addCase(setSVZonesShort, (state, { payload }) => {
        return { ...state, svZonesShort: payload };
      }),
);
