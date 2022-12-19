import {IZonesRoutingByDay} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getZonesRouting, setLoading} from "./actions";

const mockZonesRouting: IZonesRoutingByDay[] = [
    {   id: 1,
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
    }
]

interface InitialState {
    zonesRouting: IZonesRoutingByDay[],
    isLoading: boolean;
}

const initialState: InitialState = {
    zonesRouting: mockZonesRouting,
    isLoading: false,
}

export const capacityServiceValetReducer = createReducer(initialState, builder => builder
    .addCase(getZonesRouting, (state, {payload}) => {
        return {...state, zonesRouting: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
)