import { IPageRequest, IPagingResponse } from '../../../types/types';

export type TState = {
  dashboardItems: DashboardItemI[];
  customerCommunicationPageData: IPageRequest;
  customerCommunicationPaging: IPagingResponse;
  newEventName: string;
  textIntegrationSettings: null | IntegrationSettingsI;
  availablePhoneNumberList: string[];
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

export interface IntegrationSettingsI {
  serviceCenterId: number;
  legalCompanyName: string;
  website: string;
  dba: string;
  ein: string;
  addressStreet: string;
  city: string;
  state: string;
  zip: string;
  contactEmail: string;
  contactPhone: string;
  accountSid: string;
  authToken: string;
  webhookSecret: string;
  fromPhoneNumber: string;
  schedulingPageShortLink: string;
}
