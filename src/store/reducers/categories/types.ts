import {EServiceCategoryPage} from "../../../api/types";
import {IServiceRequestShort} from "../serviceRequests/types";

export interface ICategory {
    id: number;
    name: string;
    page: EServiceCategoryPage;
    iconPath?: string;
    serviceRequests: IServiceRequestShort[];
    type: EServiceCategoryType;
    orderIndex?: number;
}

export type TUpdateCategoryData = {
    name: string;
    serviceRequests?: number[];
    page: number;
    type: EServiceCategoryType;
    orderIndex?: number;
}

export type TNewCategory = TUpdateCategoryData & {
    serviceCenterId: number;
}

export enum EServiceCategoryType {
    GeneralCategory,
    MaintenancePackage,
    IndividualServices,
    LinkToPage2
}

export type TSuccessCallback = (id: number) => void;