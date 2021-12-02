import {EServiceCategoryPage} from "../../../api/types";
import {IServiceRequestShort} from "../serviceRequests/types";

export interface ICategory {
    id: number;
    name: string;
    page: EServiceCategoryPage;
    iconPath?: string;
    serviceRequests: IServiceRequestShort[];
}

export type TUpdateCategoryData = {
    name: string;
    serviceRequests: number[];
    page: number;
}

export type TNewCategory = TUpdateCategoryData & {
    serviceCenterId: number;
}