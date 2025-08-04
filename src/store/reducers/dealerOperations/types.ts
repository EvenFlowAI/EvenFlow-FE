import { IPageRequest, IPagingResponse } from '../../../types/types';

export type TState = {
  dashboardItems: DashboardItemI[];
  dealerOperationsPageData: IPageRequest;
  dealerOperationsPaging: IPagingResponse;
};

export interface DashboardItemI {
  id: number;
  name: string;
  isTextEnabled: boolean;
  communicationDetails: {
    textFrom: string;
    textMessage: string;
  };
  filterRules: {
    id: number;
    type: number;
    operator: number;
    value: string;
    isCriteria: boolean;
  }[];
  triggers: {
    id: number;
    daysFromListGeneration: number;
    scheduledTime: string;
  }[];
  serviceCenterId: number;
}
