export interface IServiceRequest {
    id: number;
    code: string;
    description: string;
    durationInHours: number;
    countOfTechnicians: number;
    skillLevelOfTechnicians: number;
    invoiceAmount: number;
    warrantyInvoiceAmount: number;
    status: string;
}
export interface IServiceRequestNonAddedFilter {
    searchTerm: string;
}

export interface IAssignedServiceRequest {

}