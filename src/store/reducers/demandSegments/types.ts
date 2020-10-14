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