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
    zonesRouting: [],
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