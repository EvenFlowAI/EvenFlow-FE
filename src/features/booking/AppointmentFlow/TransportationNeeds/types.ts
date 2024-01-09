import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {IVehicleForSlots, MPOptionShort, TRecallForRequest} from "../../../../store/reducers/appointment/types";

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