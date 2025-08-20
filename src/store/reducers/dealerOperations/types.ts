import { IPageRequest, IPagingResponse } from '../../../types/types';

export type TState = {
  dashboardItems: DashboardItemI[];
  customerCommunicationPageData: IPageRequest;
  customerCommunicationPaging: IPagingResponse;
  newEventName: string;
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
    type: number;
    operator: number;
    value: string;
    isCriteria?: boolean;
  }[];
  triggers: {
    daysFromListGeneration: number;
    scheduledTime: string;
  }[];
  serviceCenterId: number;
}
