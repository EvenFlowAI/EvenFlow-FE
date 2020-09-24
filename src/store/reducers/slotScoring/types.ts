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