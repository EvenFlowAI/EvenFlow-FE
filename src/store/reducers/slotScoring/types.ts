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

export interface IDesirability {
    id: number;
    serviceCenterId: number;
    desirability: EDesirabilityState;
    timeSlotType: ETimeSlotType;
    podId?: number;
    index: number;
}
export interface IDesirabilityItem {
    id?: number;
    index: number;
    desirability: EDesirabilityState;
}
export interface IDesirabilityForm {
    serviceCenterId: number;
    podId?: number;
    timeSlotType: ETimeSlotType;
    items: IDesirabilityItem[];
}

export interface IOptimizationSettingsItem {
    id?: number;
    from: number;
    to: number;
}
export interface IOptimizationSettingsCreateForm {
  serviceCenterId: number;
  podId?: number;
  items: IOptimizationSettingsItem[];
}
export enum EOptimizationSettingValueType {

}
export interface IOptimizationSettingValue {
    desirablePoint: number;
    undesirablePoint: number;
    type: EOptimizationSettingValueType;
    optimizationSettingsId: number;
}
export interface IOptimizationSetting {
    id: number;
    from: number;
    to: number;
    values: IOptimizationSettingValue[];
    serviceCenterId: number;
    podId?: number;
}