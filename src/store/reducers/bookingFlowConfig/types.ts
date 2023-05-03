import {EServiceType} from "../appointmentFrameReducer/types";

export enum EServiceTypeBookingFlow {
    VisitCenter, MobileService, PickUpDropOff
}

export type TServiceTypeSettings = {
    available: boolean;
    valueService: boolean;
    productPageForValueService: boolean;
    advisorSelection: boolean;
    //serviceType: EServiceTypeBookingFlow;
    serviceType: EServiceType;
    engineType: boolean;
    appointmentSelection: boolean;
    transportationNeeds: boolean;
    checkRecallsExisting: boolean;
    checkRecallsNew: boolean;
}