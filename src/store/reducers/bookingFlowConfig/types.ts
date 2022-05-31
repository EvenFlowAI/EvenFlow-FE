export enum EServiceTypeBookingFlow {
    VisitCenter, MobileService, PickUpDropOff
}

export type TServiceTypeSettings = {
    available: boolean;
    valueService: boolean;
    productPageForValueService: boolean;
    advisorSelection: boolean;
    serviceType: EServiceTypeBookingFlow;
}

export interface IBookingFlowConfig {
    visitCenter: TServiceTypeSettings;
    mobileService: TServiceTypeSettings;
    pickUpDropOff: TServiceTypeSettings;
}