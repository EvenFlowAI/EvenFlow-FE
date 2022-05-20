export type TServiceSettings = {
    available: boolean;
    valueService: boolean;
    productPageForValueService: boolean;
    advisorSelection: boolean;
}

export interface IBookingFlowConfig {
    visitCenter: TServiceSettings;
    mobileService: TServiceSettings;
    pickUpDropOff: TServiceSettings;
}