import {
    ETimeWindows,
    ICenterSettings,
    ITimeRangeAndCapacity,
    IZonesRoutingByDay,
    IZoneTimeReservation,
    IZoneTimeSlot
} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getCenterSettings, getZonesRouting, setLoading, setTimeRangesAndCapacity, setZoneTimeWindows} from "./actions";

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

const mockReservations = [
    {
        id: 1,
        zoneId: 1,
        zoneName: 'Zone 1',
        timeWindows: [
            {
                start: '8:00',
                end: '12:00',
                timeWindowType: ETimeWindows.NotAvailable,
                reservationsCount: 0,
            }
        ]
    },
    {
        id: 2,
        zoneId: 1,
        zoneName: 'Zone 1',
        timeWindows: [
            {
                start: '12:00',
                end: '14:00',
                timeWindowType: ETimeWindows.Timewindow1,
                reservationsCount: 4,
            }
        ]
    },
    {
        id: 3,
        zoneId: 2,
        zoneName: 'Zone 2',
        timeWindows: [
            {
                start: '8:00',
                end: '12:00',
                timeWindowType: ETimeWindows.Timewindow1,
                reservationsCount: 4,
            }
        ]
    }
]

interface InitialState {
    zonesRouting: IZonesRoutingByDay[];
    zoneTimeWindows: IZoneTimeSlot[];
    zoneCapacity: IZoneTimeReservation[];
    timeRangesAndCapacity: ITimeRangeAndCapacity[];
    isLoading: boolean;
    centerSettings: ICenterSettings|null;
}

const initialState: InitialState = {
    zonesRouting: mockZonesRouting,
    zoneTimeWindows: [],
    zoneCapacity: mockReservations,
    timeRangesAndCapacity: [],
    isLoading: false,
    centerSettings: null,
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
    .addCase(setTimeRangesAndCapacity, (state, {payload}) => {
        return {...state, timeRangesAndCapacity: payload};
    })
    .addCase(getCenterSettings, (state, {payload}) => {
        return {...state, centerSettings: payload};
    })
)