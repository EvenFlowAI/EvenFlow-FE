import {IPagingResponse} from "../../../types/types";

export type TIdName = {
    id: number;
    name: string;
}

export type TYearRange = {
    from: number|null;
    to: number|null;
}

export interface IRecall {
    id: number;
    recallCampaignNumber: string;
    make: TIdName;
    model: TIdName;
    yearRange: TYearRange;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: number;
    dailyPartsCount: number;
    serviceRequest: TIdName;
}

export interface ICreateUpdateRecall {
    id?: number;
    recallCampaignNumber: string;
    makeId: number|null;
    modelId: number|null;
    yearRange: TYearRange;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: number;
    dailyPartsCount: number;
    serviceRequestId: number|null;
    serviceCenterId: number;
}

export interface IRecallResponse {
    result: IRecall[],
    paging: IPagingResponse,
}