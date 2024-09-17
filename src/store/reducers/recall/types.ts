import {IPageRequest, IPagingResponse, IRecallByVin} from "../../../types/types";

export type TIdName = {
    id: number;
    name: string;
}

export interface IRecall {
    id: number;
    recallCampaignNumber: string;
    make: TIdName;
    models: TIdName[];
    yearFrom: number|null;
    yearTo: number|null;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount?: number;
    dailyPartsCount?: number;
    serviceRequest: TIdName;
}

export interface ICreateUpdateRecall {
    id?: number;
    recallCampaignNumber: string;
    makeId: number|null;
    modelIds: number[];
    yearFrom: number|null;
    yearTo: number|null;
    recallComponent: string;
    recallSummary: string;
    serviceRequestId: number|null;
    serviceCenterId: number;
}

export interface IRecallResponse {
    result: IRecall[],
    paging: IPagingResponse,
}

export type TState = {
    recalls: IRecall[];
    isLoading: boolean;
    recallPageData: IPageRequest;
    recallsCount: number,
    recallsByVin: IRecallByVin[];
}