export enum EProximityType {
    Closest,
    Earliest,
}

export interface IProximity {
    type: EProximityType;
    point: number;
    serviceCenterId?: number;
    podId?: number;
}

export enum ETimeSlotType {
    TenMinutes,
    FifteenMinutes,
    ThirtyMinutes
}
export enum EDesirabilityState {
    Neutral, Desirable, Undesirable
}