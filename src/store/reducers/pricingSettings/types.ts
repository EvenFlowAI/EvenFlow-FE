
export enum EDemandCategory {
    Low, Average, High
}
export interface IPricingLevel {
    demandCategory: EDemandCategory;
    percentage: number;
    serviceCenterId: number;
}
export enum EWindowType {
    Window1, Window2, Window3
}
export interface ITimeWindowEl {
    type: EWindowType;
    startInHours: number;
    durationInHours?: number;
    isEligibility: boolean;
    serviceCenterId: number;
    podId?: number;
}