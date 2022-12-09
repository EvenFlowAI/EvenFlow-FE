export type TMakeModel = {
    id: number;
    name: string;
}

export interface IRecall {
    id: number;
    recallCampaignNumber: string;
    make: TMakeModel;
    model: TMakeModel;
    year: number;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: number;
    dailyPartsCount: number;
    serviceRequestId: number;
    serviceRequestCode: string;
    serviceCenterId: number;
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
}