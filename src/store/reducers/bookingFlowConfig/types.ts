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