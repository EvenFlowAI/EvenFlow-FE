export type TIdName = {
    id: number;
    name: string;
}

export interface IRecall {
    id: number;
    recallCampaignNumber: string;
    make: TIdName;
    model: TIdName;
    year: number;
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
    year: number;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: number;
    dailyPartsCount: number;
    serviceRequestId: number|null;
    serviceCenterId: number;
}