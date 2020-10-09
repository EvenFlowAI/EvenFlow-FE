import {createReducer} from "@reduxjs/toolkit";
import {IDemandSegment} from "./types";

type TState = {
    demandSegmentList: IDemandSegment[]
}

const initialState: TState = {
    demandSegmentList: []
}
export const demandSegmentsReducer = createReducer(initialState, builder => builder

);