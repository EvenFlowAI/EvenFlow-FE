import { IOrder, IPageRequest, IPagingResponse, IRecallByVin, TOption } from '../../../types/types';
import type { TriggerI } from '../../../pages/admin/DealerOperations/Customer/types';

export type TIdName = {
  id: number;
  name: string;
};

export interface IRecallPartGroupItem {
  id: number;
  recallPartGroupId: number;
  make: TIdName | null;
  model: TIdName | null;
  year: number | null;
  itemIndex: number;
  numberOfVehiclesInDms?: number;
}

export interface IRecallPartGroup {
  id: number;
  recallPartId: number;
  recallComponent?: string;
  serviceRequest?: TIdName | null;
  groupIndex: number;
  numberOfVehiclesInDms?: number;
  items: IRecallPartGroupItem[];
}

export interface IRecall {
  id: number;
  serviceCenterId?: number;
  recallCampaignNumber?: string;
  oemProgram?: string;
  recallComponent: string;
  recallSummary: string;
  reportedDate?: string;
  impactedVehicles?: number;
  doNotDrive?: boolean;
  fireRisk?: boolean;
  safetyRisk?: string;
  remedy?: string;
  partLeadDaysCount: number;
  dailyPartsCount: number;
  isRemedyAvailable: boolean;
  rolloverMessage?: string;
  serviceRequest: TIdName | null;
  groups: IRecallPartGroup[];
  localIndex: number;
}

export enum RecallListType {
  VIN_CHECK_API,
  CSV_UPLOADED,
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
  vinsFileLink?: string;
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

export interface IEditRecall {
  serviceCenterId: number;
  recallComponent: string;
  serviceRequestId: number | null;
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
  eligibleVehicleCount: number;
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
    listType: RecallListType;
    recallCampaignId: number | null;
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
  makeIds?: number[];
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
export interface IRecallGroupingItemRequest {
  id: number;
  itemIndex: number;
}
export interface IRecallGroupingGroupRequest {
  groupId?: number;
  groupIndex: number;
  serviceRequestId: number | null;
  recallComponent: string;
  items: IRecallGroupingItemRequest[];
}
export interface IRecallGroupingRequest {
  serviceCenterId: number;
  groups: IRecallGroupingGroupRequest[];
}
export interface IRecallSyncRequest {
  serviceCenterId: number;
  makeIds: number[];
}
