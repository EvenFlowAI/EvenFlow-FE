export interface IServiceRequest {
    id: number;
    code: string;
    description: string;
    durationInHours: number;
    countOfTechnicians: number;
    skillLevelOfTechnicians: number;
    invoiceAmount: number;
    warrantyInvoiceAmount: number;
    status: EServiceStatus;
    price: number;
    partsUnitCost: number;
    numberOfParts: number;
}
export interface IServiceRequestShort {
    id: 0;
    code: string;
    description: string;
    priority: IServiceRequestPriority
    price: number;
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
    partsAmount?: number;
    partsUnitCost?: number;
    numberOfParts?: number;
}
export interface IServiceRequestOverrideEditRequest {
    serviceRequestInfo: Partial<IServiceRequestOverride>;
}

export interface IRequiredSkill {
    technicianLevel1: boolean;
    technicianLevel2: boolean;
    technicianLevel3: boolean;
}
export interface IRequiredSkillData extends IRequiredSkill{
    serviceRequestId: number;
}
export interface IRequiredSkillRequest {
    requiredSkills: IRequiredSkillData[]
}
export enum IServiceRequestPriority {
    Default, Urgent
}
export enum EServiceStatus {
    None, Archived
}

export interface IAssignedServiceRequest {
    id: number;
    serviceRequest: IServiceRequest;
    serviceRequestId: number;
    serviceCenterId: number;
    isEligibility: boolean;
    serviceRequestOverride?: Partial<IServiceRequestOverride>;
    priority: IServiceRequestPriority;
    requiredSkill?: IRequiredSkill;
}
export interface IAssignedServiceRequestShort {
    id: number;
    code: string;
    description: string;
    priority: IServiceRequestPriority
}
export interface IPrioritizeItem {
    id: number;
    priority: IServiceRequestPriority
}
export interface IPrioritizeRequest {
    podId?: number;
    items: IPrioritizeItem[]
}

export interface ISRAdminFilters {
    searchTerm: string;
}

export interface ISRAdminForm {
    code: string;
    description: string;
    durationInHours: number;
    countOfTechnicians: number;
    skillLevelOfTechnicians: number;
    invoiceAmount: number;
    warrantyInvoiceAmount: number
    numberOfParts: number;
    partsUnitCost: number;
}

export interface ISRAdmin {
    id: number;
    code: string;
    description: string;
    durationInHours: number;
    countOfTechnicians: number;
    skillLevelOfTechnicians: number;
    invoiceAmount: number;
    warrantyInvoiceAmount: number;
    status: EServiceStatus;
    numberOfParts: number;
    partsUnitCost: number;
}