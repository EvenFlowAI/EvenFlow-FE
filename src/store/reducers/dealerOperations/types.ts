import { IPageRequest, IPagingResponse } from '../../../types/types';

export type TState = {
  dashboardItems: DashboardItemI[];
  customerCommunicationPageData: IPageRequest;
  customerCommunicationPaging: IPagingResponse;
  newEventName: string;
  textIntegrationSettings: null | IntegrationSettingsI;
  availablePhoneNumberList: string[];
  textMessage: string;
  eventForTextConfiguration: DashboardItemI | null;
  eventIdForRulesConfiguration: number | null;
  updatedEventsName: {
    id: number;
    name: string;
  }[];
};

export interface DashboardItemI {
  id: number;
  name: string;
  isTextEnabled: boolean;
  communicationDetails: {
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
  legalCompanyName: string | null;
  website: string | null;
  dba: string | null;
  ein: string | null;
  addressStreet: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  accountSid: string | null;
  authToken: string | null;
  webhookSecret: string | null;
  fromPhoneNumber: string | null;
  schedulingPageShortLink: string | null;
}
