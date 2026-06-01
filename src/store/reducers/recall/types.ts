import { IOrder, IPageRequest, IPagingResponse, IRecallByVin, TOption } from '../../../types/types';

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

export interface IRecallAlert {
  actualRecipients: number;
  nhtsaCampaign: string;
  recallComponent: string;
  id: number;
  name: string;
  campaignRecallGroupBatchId: string;
  recallCampaignId: number;
  status: number;
  listType: number;
  communicationDetails: {
    textMessage: string;
    textMessageTrimmed: string;
  };
  vehiclesInDms: number;
  creditsUsed: number;
  estimatedRecipients: number;
  triggers: [];
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
  recallCampaignInfo: IRecallCampaign[];
  selectedStatus: TOption;
  updatedAlerts: {
    id: number;
    name: string;
  }[];
  isEditName: boolean;
  isRecallAlertsTableLoading: boolean;
  selectedRecallAlert: IRecallAlert | null;
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
