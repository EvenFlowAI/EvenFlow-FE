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
}

export interface IUnplannedDemandRequest {
    items: IUnplannedDemandForm[];
    serviceCenterId: number;
    podId?: number;
}

export interface IUnplannedDemandSlotsRequest {
    serviceCenterId: number;
    day: EDay;
    podId?: number;
}

export type TUnplannedSlot = {
    id: number;
    amount: number;
}

export interface IUnplannedSlotUpdateData {
    serviceCenterId: number;
    day: EDay;
    items: TUnplannedSlot[]
    podId?: number;
}