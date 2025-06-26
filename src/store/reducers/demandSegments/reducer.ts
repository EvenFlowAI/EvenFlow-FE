import { createReducer } from '@reduxjs/toolkit';
import {
  EDay,
  IDemandSegment,
  ITimeWindow,
  IUnplannedDemand,
  IUnplannedDemandBySlot,
} from './types';
import {
  getDemandCapacity,
  getDemandSegments,
  getTimeWindow,
  getUnplannedDemand,
  loadingDemandSegments,
  setRecalculationLoading,
  setTimeWindowsLoading,
  setUnplannedLoading,
  setUnplannedSlots,
} from './actions';
import { DemandCapacityI } from '../../../features/admin/UnplannedDemand/types';

type TState = {
  demandSegmentList: IDemandSegment[];
  listLoading: boolean;
  timeWindow: ITimeWindow;
  unplannedDemands: IUnplannedDemand[];
  unplannedSlots: IUnplannedDemandBySlot[];
  demandCapacity: DemandCapacityI[];
  isSlotsLoading: boolean;
  isRecalculationLoading: boolean;
  isTimeWindowLoading: boolean;
};
type TPDemandSegment = {
  window1Point: number;
  window2Point: number;
  window3Point: number;
};
export const defaultDemandSegment: TPDemandSegment = {
  window1Point: 100,
  window2Point: 100,
  window3Point: 100,
};

const initialState: TState = {
  demandSegmentList: [],
  listLoading: false,
  timeWindow: {
    durationInHours: 0,
    serviceCenterId: 0,
    startInHours: 0,
  },
  unplannedDemands: [],
  demandCapacity: [],
  unplannedSlots: [],
  isSlotsLoading: false,
  isRecalculationLoading: false,
  isTimeWindowLoading: false,
};
export const demandSegmentsReducer = createReducer(initialState, builder =>
  builder
    .addCase(getDemandSegments, (state, { payload }) => {
      return { ...state, demandSegmentList: payload };
    })
    .addCase(loadingDemandSegments, (state, { payload }) => {
      return { ...state, listLoading: payload };
    })
    .addCase(getTimeWindow, (state, { payload }) => {
      return { ...state, timeWindow: payload };
    })
    .addCase(getUnplannedDemand, (state, { payload }) => {
      return { ...state, unplannedDemands: payload };
    })
    .addCase(getDemandCapacity, (state, { payload }) => {
      return { ...state, demandCapacity: payload };
    })
    .addCase(setUnplannedLoading, (state, { payload }) => {
      return { ...state, isSlotsLoading: payload };
    })
    .addCase(setUnplannedSlots, (state, { payload }) => {
      return { ...state, unplannedSlots: payload };
    })
    .addCase(setRecalculationLoading, (state, { payload }) => {
      return { ...state, isRecalculationLoading: payload };
    })
    .addCase(setTimeWindowsLoading, (state, { payload }) => {
      return { ...state, isTimeWindowLoading: payload };
    })
);
