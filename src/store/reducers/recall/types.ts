export interface IRecall {
    id: number;
    recallCampaignNumber: string;
    make: string;
    model: string;
    year: number;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: number;
    dailyPartsCount: string;
    serviceRequestId: number;
    serviceRequestCode: string;
    serviceCenterId: number;
}