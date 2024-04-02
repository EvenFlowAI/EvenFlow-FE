import {createReducer} from "@reduxjs/toolkit";
import {
    setCurrentZone,
    setLoading,
    setMobileServicePrisingByDistance,
    setMobileServicePrisingByZones,
    setMobileServicePrisingOption,
    setPricingOptionLoading,
    setZones, setMobileZonesShort
} from "./actions";
import {EAncillaryPriceType, TState} from "./types";

const initialState: TState = {
    isLoading: false,
    currentZone: null,
    zones: [],
    pricingByZones: [],
    pricingByDistance: [],
    isPricingByZoneLoading: false,
    ancillaryPriceType: EAncillaryPriceType.Zone,
    mobileZonesShort: [],
}

export const mobileServiceReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setCurrentZone, (state, {payload}) => {
        return {...state, currentZone: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(setZones, (state, {payload}) => {
        return {...state, zones: payload}
    })
    .addCase(setMobileServicePrisingByZones, (state, {payload}) => {
        return {...state, pricingByZones: payload}
    })
    .addCase(setMobileServicePrisingByDistance, (state, {payload}) => {
        return {...state, pricingByDistance: payload}
    })
    .addCase(setMobileServicePrisingOption, (state, {payload}) => {
        return {...state, ancillaryPriceType: payload}
    })
    .addCase(setPricingOptionLoading, (state, {payload}) => {
        return {...state, isPricingByZoneLoading: payload}
    })
    .addCase(setMobileZonesShort, (state, {payload}) => {
        return {...state, mobileZonesShort: payload}
    })
)