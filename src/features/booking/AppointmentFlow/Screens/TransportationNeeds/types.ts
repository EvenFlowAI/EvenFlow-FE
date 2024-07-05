import {IVehicleForSlots, MPOptionShort, TRecallForRequest} from "../../../../../store/reducers/appointment/types";
import {ParsableDate} from "../../../../../types/types";

export type TTransportationData = {
    serviceCenterId: number;
    serviceRequestIds: number[];
    slot: ParsableDate;
    serviceCategoryIds: number[];
    appointmentHashKey?: string;
    recalls: TRecallForRequest[];
    maintenancePackageOption: MPOptionShort | null;
    vehicle: IVehicleForSlots;
}