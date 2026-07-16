import { IOrder, IPageRequest, IPagingResponse, IRecallByVin, TOption } from '../../../types/types';
import type { TriggerI } from '../../../pages/admin/DealerOperations/Customer/types';

export type TIdName = {
  id: number;
  name: string;
};

export interface IRecall {
  id: number;
  recallCampaignNumber?: string;
  make: TIdName;
  models: TIdName[];
  model?: {
    id: number;
    name: string;
  };
  yearFrom: number | null;
  yearTo: number | null;
  recallComponent: string;
  recallSummary: string;
  partLeadDaysCount: number;
  dailyPartsCount: number;
  serviceRequest: TIdName;
  oemProgram?: string;
  isRemedyAvailable: boolean;
  rolloverMessage?: string;
  localIndex: number;
}

export enum RecallListType {
  VIN_CHECK_API,
  UPLOAD_CSV,
}

export interface IGlobalModelYear {
  globalVehicleModelId: number;
  year: number;
}

export interface IRecallAlert {
  actualRecipients: number;
  nhtsaCampaign: string;
  recallComponent: string;
  id: number;
  name: string;
  listGeneratedDate: string;
  globalModelIds: number[];
  campaignRecallGroupBatchId: number;
  recallCampaignId: number | null;
  status: number;
  listType: RecallListType;
  communicationDetails: {
    textMessage: string;
    textMessageTrimmed: string;
  };
  vehiclesInDms: number;
  creditsUsed: number;
  estimatedRecipients: number;
  triggers: TriggerI[];
  filterRules: {
    id?: number;
    type: string;
    operator: string;
    value: string;
    isCriteria?: boolean;
  }[];
}

export interface ICreateUpdateRecall {
  id?: number;
  recallCampaignNumber?: string;
  makeId: number | null;
  modelIds: number[];
  yearFrom: number | null;
  yearTo: number | null;
  recallComponent: string;
  recallSummary: string;
  serviceRequestId: number | null;
  serviceCenterId: number;
  oemProgram?: string;
}

export interface IRecallResponse {
  result: IRecall[];
  paging: IPagingResponse;
}

export interface IRecallCampaign {
  id: number;
  impactedVehicles: number;
  manufacturer: string;
  nhtsaCampaign: string;
  oemProgram: string;
  recallComponent: string;
  reportedDate: string;
}

export interface IRecallAffectedModel {
  globalVehicleModelId: number;
  make: string;
  model: string;
  vehicleCount: number;
  year: number;
}

export type TState = {
  recalls: IRecall[];
  recallAlerts: IRecallAlert[];
  isLoading: boolean;
  recallPageData: IPageRequest;
  recallAlertsPageData: IPageRequest;
  recallsCount: number;
  recallAlertsCount: number;
  recallsByVin: IRecallByVin[];
  order: IOrder<IRecall>;
  recallAlertsOrderWorkflow: IOrder<IRecallAlert>;
  recallAlertsOrderStats: IOrder<IRecallAlert>;
  searchTerm: string;
  recallByVinLoading: boolean;
  recallCampaignInfo: IRecallCampaign[];
  selectedStatus: TOption;
  updatedAlerts: {
    id: number;
    name: string;
  }[];
  isEditName: boolean;
  isRecallAlertsTableLoading: boolean;
  selectedRecallAlert: IRecallAlert | null;
  isRecallAlertSettingsEditMode: boolean;
  affectedModels: IRecallAffectedModel[];
  hasManufacturerDidNotReturnRecalls: boolean;
};

export type TRecallRequest = {
  serviceCenterId: number;
  pageSize: number;
  pageIndex: number;
  orderBy?: string;
  isAscending?: boolean;
  searchTerm?: string;
  status?: string;
};

export type TUpdateRecall = {
  id: number;
  partLeadDaysCount: number;
  dailyPartsCount: number;
  isRemedyAvailable: boolean;
  rolloverMessage?: string;
};
