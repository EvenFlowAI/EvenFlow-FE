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
    items: IPrioritizeItem[]
}