export interface IDmsConfigurationServiceRequest {
  code: string;
  description: string;
  price: number;
  type: string;
  isConfigured: boolean;
}

export interface IDmsConfigurationEmployee {
  fullName: string;
  dmsId: string;
  role: string;
}

export interface IDmsConfigurationTransportation {
  id: string;
  description: string;
}

export interface IDmsConfiguration {
  serviceRequests: IDmsConfigurationServiceRequest[];
  employees: IDmsConfigurationEmployee[];
  transportations: IDmsConfigurationTransportation[];
}

export interface IDmsConfigurationQuery {
  serviceCenterId: number;
  makeId: number;
  modelId: number;
  year?: number;
}

export interface IDmsConfigurationApiError {
  id?: string;
  message?: string;
  errors?: string;
  errorCode?: string;
}

export interface IDmsConfigurationApiResponse<T> {
  isSuccess: boolean;
  code: string;
  data: T | null;
  error?: IDmsConfigurationApiError | null;
}

export interface ICreateDmsServiceRequestsPayload extends IDmsConfigurationQuery {
  codes: string[];
}

export interface ICreateDmsServiceRequestsResult {
  inserted: number;
  updated: number;
  failed: number;
}

export type TState = {
  configuration: IDmsConfiguration | null;
  query: IDmsConfigurationQuery | null;
  isLoading: boolean;
};
