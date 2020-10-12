import {createReducer} from "@reduxjs/toolkit";
import {IDemandSegment, ITimeWindow} from "./types";
import {getDemandSegments, getTimeWindow, loadingDemandSegments} from "./actions";

type TState = {
    demandSegmentList: IDemandSegment[];
    listLoading: boolean;
    timeWindow: ITimeWindow;
}
type TPDemandSegment = {
    window1Point: number;
    window2Point: number;
    window3Point: number;
}
export const defaultDemandSegment: TPDemandSegment = {
    window1Point: 100,
    window2Point: 100,
    window3Point: 100
}

const initialState: TState = {
    demandSegmentList: [],
    listLoading: false,
    timeWindow: {
        durationInHours: 0,
        serviceCenterId: 0,
        startInHours: 0,
    }
}
export const demandSegmentsReducer = createReducer(initialState, builder => builder
    .addCase(getDemandSegments, (state, {payload}) => {
        return {...state, demandSegmentList: payload};
    })
    .addCase(loadingDemandSegments, (state, {payload}) => {
        return {...state, listLoading: payload};
    })
    .addCase(getTimeWindow, (state, {payload}) => {
        return {...state, timeWindow: payload};
    })
);