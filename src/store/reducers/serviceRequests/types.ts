export interface IServiceRequest {
    id: number;
    code: string;
    description: string;
    durationInHours: string;
    countOfTechnicians: number;
    skillLevelOfTechnicians: number;
    invoiceAmount: number;
    warrantyInvoiceAmount: number;
    status: string;
}
export interface IServiceRequestNonAddedFilter {
    searchTerm: string;
}