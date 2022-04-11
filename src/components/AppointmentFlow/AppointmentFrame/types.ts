import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export type TActionProps = {
    onBack: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLabel?: string;
    loading?: boolean;
    onAddServices?: () => void;
};

export type EMaintenanceItemType = 'category' | 'package' | 'service'

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