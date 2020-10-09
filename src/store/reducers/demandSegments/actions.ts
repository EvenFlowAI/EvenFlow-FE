import {createAction} from "@reduxjs/toolkit";
import {IDemandSegment} from "./types";
import {AppThunk} from "../../../types/types";

export const getDemandSegments = createAction<IDemandSegment[]>("DemandSegments/GetDemandSegments");
export const loadDemandSegments = (serviceCenterId: number): AppThunk => async dispatch => {

}