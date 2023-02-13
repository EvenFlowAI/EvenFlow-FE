import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";

export type TActionProps = {
    onBack: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices?: () => void;
    prevDisabled?: boolean;
    prevLabel?: string;
};

export type EMaintenanceItemType = 'category' | 'package' | 'service' | 'valueService' | 'recall'

export type IMaintenanceItem = {
    id: number;
    name: string;
    type: EMaintenanceItemType;
}

export type TTransportationData = {
    serviceCenterId: number;
    serviceRequestIds: number[];
    maintenancePackageOptionId: number | null;
    slot: ParsableDate;
    serviceCategoryIds: number[];
    appointmentHashKey?: string;
}

export interface IRecallByVin {
    shortDescription: string;
    recallOpenDate: string;
    recallComponent: string;
    nhtsaRecallNumber: string;
    recallStatus: string;
    summary: string;
    safetyRisk: string;
    serviceRequestId: number;
}

export type TCard = {
    description: string;
    name: EAppointmentTimingType;
    icon: JSX.Element;
}
