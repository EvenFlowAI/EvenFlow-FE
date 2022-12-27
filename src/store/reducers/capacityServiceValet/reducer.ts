import {IZonesRoutingByDay, IZoneTimeSlot} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getZonesRouting, setLoading, setZoneTimeWindows} from "./actions";

const mockZonesRouting: IZonesRoutingByDay[] = [
    {   id: 61,
        day: 0,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 2",
                id: 2,
            },
            {
                name: "Zone 3",
                id: 3,
            },
            {
                name: "Zone 4",
                id: 4,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    },
    {   id: 62,
        day: 1,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 2",
                id: 2,
            },
            {
                name: "Zone 3",
                id: 3,
            },
            {
                name: "Zone 4",
                id: 4,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    },
    {   id: 5,
        day: 2,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 2",
                id: 2,
            },
            {
                name: "Zone 3",
                id: 3,
            },
            {
                name: "Zone 4",
                id: 4,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    },
    {   id: 2,
        day: 3,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 4",
                id: 4,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    },
    {   id: 6,
        day: 4,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 4",
                id: 4,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    },
    {   id: 3,
        day: 5,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    },
    {   id: 8,
        day: 6,
        zones: [
            {
                name: "Zone 1",
                id: 1,
            },
            {
                name: "Zone 5",
                id: 5,
            },
        ]
    }
]

interface InitialState {
    zonesRouting: IZonesRoutingByDay[],
    zoneTimeWindows: IZoneTimeSlot[],
    isLoading: boolean;
}

const initialState: InitialState = {
    zonesRouting: mockZonesRouting,
    zoneTimeWindows: [],
    isLoading: false,
}

export const capacityServiceValetReducer = createReducer(initialState, builder => builder
    .addCase(getZonesRouting, (state, {payload}) => {
        return {...state, zonesRouting: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(setZoneTimeWindows, (state, {payload}) => {
        return {...state, zoneTimeWindows: payload};
    })
)