
export enum EDemandCategory {
    Low, Average, High
}
export interface IPricingLevel {
    demandCategory: EDemandCategory;
    percentage: number;
    serviceCenterId: number;
}