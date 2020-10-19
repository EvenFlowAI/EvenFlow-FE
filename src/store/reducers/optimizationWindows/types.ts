export enum EOptimizationWindowType {
    FirstAvailable, SpecificDate, DemandSegments, OverbookingFactor, AppointmentsPerSlot
}
export interface IOptimizationWindow {
    type: EOptimizationWindowType;
    value: number;
    serviceCenterId: number;
    podId?: number;
}

export const optimizationWindowsList: EOptimizationWindowType[] = [
    EOptimizationWindowType.FirstAvailable,
    EOptimizationWindowType.SpecificDate,
    EOptimizationWindowType.DemandSegments,
    EOptimizationWindowType.OverbookingFactor,
    EOptimizationWindowType.AppointmentsPerSlot,
]