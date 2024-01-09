import {EDemandCategory} from "../../../store/reducers/pricingSettings/types";

export type TPricingLevel = {
    id: number;
    serviceRequest: string;
    opsCode: string;
    discount: string | null;
    premium: string | null;
};

export type TPackagePricingLevel = {
    maintenancePackageName: string;
    maintenancePackageId: number;
    discount: string | null;
    premium: string | null;
    maintenancePackageOptionName: string;
    maintenancePackageOptionId: number;
};

type TValue = {
    demandCategory: EDemandCategory.Low | EDemandCategory.High;
    value: number;
}

export type TUpdatedSettings = {
    serviceCenterId: number;
    values: TValue[];
}