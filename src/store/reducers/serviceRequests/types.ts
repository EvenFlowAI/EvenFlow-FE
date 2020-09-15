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

export interface IServiceRequestOverride {
    description: string;
    durationInHours: number;
    countOfTechnicians: number;
    skillLevelOfTechnicians: number;
    invoiceAmount: number;
    warrantyInvoiceAmount: number;
}
export interface IServiceRequestOverrideEditRequest {
    serviceRequestInfo: Partial<IServiceRequestOverride>;
}

export interface IRequiredSkill {
    technicianLevel1: boolean;
    technicianLevel2: boolean;
    technicianLevel3: boolean;
}
export interface IAssignedServiceRequest {
    id: number;
    serviceRequest: IServiceRequest;
    serviceRequestId: number;
    serviceCenterId: number;
    serviceRequestOverride?: Partial<IServiceRequestOverride>;
    priority: string;
    requiredSkill?: IRequiredSkill;
}