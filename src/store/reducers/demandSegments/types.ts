import {ETimeSlotType} from "../slotScoring/types";

export interface IDemandSegment {
    id: number;
    window1Point: number;
    window2Point: number;
    window3Point: number;
    serviceCenterId: number;
    podId?: number;
}
export interface IDemandSegmentForm extends Omit<IDemandSegment, "id"> {
    id?: number;
}
export interface ITimeWindow {
    startInHours: number;
    durationInHours: number;
    serviceCenterId: number;
    podId?: number;
}
export interface ISetDemandSegmentForm {
    id: number;
    window1Point: number;
    window2Point: number;
    window3Point: number;
}
export interface ISetDemandSegmentRequest {
    segments: ISetDemandSegmentForm[];
    serviceCenterId: number;
    podId?: number;
}
export enum EDay {
    Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
}
export interface IUnplannedDemand {
    day: EDay;
    optimizerSetting?: number;
    serviceCenterId: number;
    historicalWalkInScheduleBlocks: number;
    podId?: number;
}
export interface IUnplannedDemandForm {
    day: EDay;
    optimizerSetting: number;
}

export interface IUnplannedDemandBySlot {
    id: number;
    day: EDay;
    start: string;
    end: string;
    amount: number|string;
    timeSlotType: ETimeSlotType;
}

export interface IUnplannedDemandRequest {
    items: IUnplannedDemandForm[];
    serviceCenterId: number;
    podId?: number;
}