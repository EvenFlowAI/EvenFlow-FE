import {IVehicleForSlots, MPOptionShort, TRecallForRequest} from "../../../../../store/reducers/appointment/types";

export type TTransportationData = {
    serviceCenterId: number;
    serviceRequestIds: number[];
    serviceCategoryIds: number[];
    appointmentHashKey?: string;
    recalls: TRecallForRequest[];
    maintenancePackageOption: MPOptionShort | null;
    vehicle: IVehicleForSlots;
}