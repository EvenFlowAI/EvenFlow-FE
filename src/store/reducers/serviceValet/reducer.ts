import {createReducer} from "@reduxjs/toolkit";
import {
    setCurrentZone,
    setLoading,
    setServiceValetPrisingByDistance,
    setServiceValetPrisingByZones,
    setZones
} from "./actions";
import {TZone} from "../mobileService/types";
import {IDistancePriceSettings, IZonePriceSettings} from "./types";

type TState = {
    isLoading: boolean;
    currentZone: any;
    zones: TZone[];
    pricingByZones: IZonePriceSettings[];
    pricingByDistance: IDistancePriceSettings[];
}

const initialState: TState = {
    isLoading: false,
    currentZone: null,
    zones: [],
    pricingByZones: [],
    pricingByDistance: [],
}

export const serviceValetReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setCurrentZone, (state, {payload}) => {
        return {...state, currentZone: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(setZones, (state, {payload}) => {
        return {...state, zones: payload}
    })
    .addCase(setServiceValetPrisingByZones, (state, {payload}) => {
        return {...state, pricingByZones: payload}
    })
    .addCase(setServiceValetPrisingByDistance, (state, {payload}) => {
        return {...state, pricingByDistance: payload}
    })
)