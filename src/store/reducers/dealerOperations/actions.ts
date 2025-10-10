/* eslint-disable max-lines */

import { createAction } from '@reduxjs/toolkit';
import { DashboardItemI, IntegrationSettingsI } from './types';
import { AppThunk, IPageRequest, IPagingResponse } from '../../../types/types';
import { ActionCreator } from 'redux';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const getDashboardItems = createAction<DashboardItemI[]>(
  'DealerOperations/GetDashboardItems'
);

export const setCustomerCommunicationDashboardPageData = createAction<Partial<IPageRequest>>(
  'Optimizer/setCustomerCommunicationDashboardPageData'
);

export const getCustomerCommunicationPaging = createAction<IPagingResponse>(
  'Optimizer/getCustomerCommunicationPaging'
);

export const setNewEventName = createAction<string>('DealerOperations/SetNewEventName');

export const getTextIntegrationSettings = createAction<IntegrationSettingsI | null>(
  'Optimizer/getTextIntegrationSettings'
);

export const getAvailablePhoneNumberList = createAction<string[]>(
  'Optimizer/getAvailablePhoneNumberList'
);

export const setTextMessage = createAction<string>('Optimizer/setTextMessage');

export const setEventForTextConfiguration = createAction<DashboardItemI | null>(
  'Optimizer/setEventForTextConfiguration'
);

export const setEventIdForRulesConfiguration = createAction<number | null>(
  'Optimizer/setEventIdForRulesConfiguration'
);

export const setUpdatedEventsName = createAction<
  {
    id: number;
    name: string;
  }[]
>('Optimizer/setUpdatedEventsName');

export const setTextIntegrationSettings = createAction<IntegrationSettingsI>(
  'Optimizer/setTextIntegrationSettings'
);

export enum EventAudienceFilterTypeE {
  DaysToFutureAppointment = 1,
}

export enum EventRulesFilterTypeE {
  'Days To Future Appointment',
  'Days From Last No Show Appointment',
  'Days From Last Cancel Appointment',
  'Days From Last Showed Appointment',
  'Days From Last Open Ro',
  'Days From Last Closed Ro',
}

export enum ComparisonOperatorE {
  'Less than',
  'Equal',
  'Greater than',
}

export const loadTextIntegrationSettings =
  (serviceCenterId: number, hideLoader?: () => void): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.GetTextIntegration, { params: { serviceCenterId } })
      .then(response => {
        if (response?.data) {
          dispatch(getTextIntegrationSettings(response?.data));
        } else {
          console.log('No data with text integration settings');
        }
        if (hideLoader) hideLoader();
      })
      .catch(e => {
        console.log('Loading text integration settings error', e);
      });
  };

export const updateTextIntegrationSettings =
  (data: IntegrationSettingsI, updateEvents?: boolean, hideLoader?: () => void): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.SetTextIntegration, {
      data: { ...data },
    })
      .then(response => {
        if (response) {
          dispatch(loadTextIntegrationSettings(data.serviceCenterId));
          if (updateEvents) dispatch(loadDashboardItems(data.serviceCenterId));
        } else {
          console.log('No response with updating text integration settings');
        }
        if (hideLoader) hideLoader();
      })
      .catch(e => {
        console.log('Updating text integration settings error', e);
      });
  };

export const getPhoneNumbers =
  (
    accountSid: string,
    authToken: string,
    webhookSecret: string,
    handleNoFoundNumberList?: () => void,
    updateIsProcessingRequest?: (value: boolean) => void
  ): AppThunk =>
  async dispatch => {
    if (updateIsProcessingRequest) updateIsProcessingRequest(true);
    Api.call(Api.endpoints.DealerOperations.GetPhoneNumbers, {
      data: {
        accountSid,
        authToken,
        webhookSecret,
      },
    })
      .then(response => {
        if (response?.data) {
          dispatch(getAvailablePhoneNumberList(response.data));
        }
        if (updateIsProcessingRequest) updateIsProcessingRequest(false);
      })
      .catch(e => {
        const errorObj = e.response?.data;
        if (handleNoFoundNumberList) {
          if (errorObj.errorCode === 4) {
            handleNoFoundNumberList();
          }
        }
        dispatch(getAvailablePhoneNumberList([]));
        if (updateIsProcessingRequest) updateIsProcessingRequest(false);
      });
  };

export const loadDashboardItems =
  (serviceCenterId: number, hideLoader?: () => void): AppThunk =>
  async (dispatch, getState) => {
    const { customerCommunicationPageData } = getState().dealerOperations;
    const data = {
      serviceCenterId,
      pageIndex: customerCommunicationPageData.pageIndex,
      pageSize: customerCommunicationPageData.pageSize,
    };

    Api.call(Api.endpoints.DealerOperations.GetEvents, { params: data })
      .then(response => {
        if (response?.data) {
          dispatch(getDashboardItems(response.data.result));
          dispatch(getCustomerCommunicationPaging(response.data.paging));
          if (
            response.data.paging.numberOfPages > 0 &&
            response.data.paging.numberOfPages < customerCommunicationPageData.pageIndex + 1
          ) {
            dispatch(
              setCustomerCommunicationDashboardPageData({
                ...customerCommunicationPageData,
                pageIndex: response.data.paging.numberOfPages - 1,
              })
            );
          }
        } else {
          console.log('No data with events');
        }
        if (hideLoader) hideLoader();
      })
      .catch(e => {
        console.log('Loading dashboard items error', e);
      });
  };

export const createCustomerEvent =
  (
    data: { serviceCenterId: number; name: string },
    onClose: () => void,
    onError?: () => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.CreateEvent, {
      data,
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId));
        onClose();
      })
      .catch(e => {
        if (onError) onError();
        console.log('Creating Customer Event error', e);
      });
  };

export const deleteCustomerEvent =
  (data: { serviceCenterId: number; id: number }, hideLoader?: () => void): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.DeleteEvent, { urlParams: { id: data.id } })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId, hideLoader));
      })
      .catch(e => {
        console.log('Deleting Customer Event error', e);
      });
  };

export const updateCustomerEventName =
  (
    data: {
      id: number;
      name: string;
      serviceCenterId: number;
    },
    onSuccess: () => void,
    onError?: (eventName: string) => void,
    hideLoader?: () => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.UpdateEvent, {
      urlParams: { id: data.id },
      data: { ...data },
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId, hideLoader));
        onSuccess();
      })
      .catch(e => {
        if (onError) onError(data.name);
        console.log('Update Customer Event error', e);
      });
  };

export const updateCustomerEvent =
  (
    data: {
      serviceCenterId: number;
      eventId: number;
      updatedData:
        | {
            communicationDetails: {
              textMessage: string;
            };
          }
        | { isTextEnabled: boolean };
    },
    onClear: () => void,
    hideLoader?: () => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.UpdateEvent, {
      urlParams: { id: data.eventId },
      data: { ...data.updatedData, id: data.eventId, serviceCenterId: data.serviceCenterId },
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId, hideLoader));
        onClear();
      })
      .catch(e => {
        console.log('Update Customer Event error', e);
      });
  };

export const updateCustomerEventRulesC =
  (
    data: {
      serviceCenterId: number;
      eventId: number;
      filterRules: {
        type: string;
        operator: string;
        value: string;
        isCriteria?: boolean;
      }[];
      triggers: {
        id?: string;
        daysFromListGeneration: number;
        scheduledTime: string;
      }[];
    },
    onSuccess: () => void
  ): AppThunk =>
  async dispatch => {
    const filterRules = data.filterRules.map(el => {
      return {
        ...el,
        type: EventRulesFilterTypeE[el.type as keyof typeof EventRulesFilterTypeE],
        operator: ComparisonOperatorE[el.operator as keyof typeof ComparisonOperatorE],
        value: el.value || '0',
      };
    });

    Api.call(Api.endpoints.DealerOperations.UpdateEvent, {
      urlParams: { id: data.eventId },
      data: {
        filterRules,
        triggers: data.triggers,
        id: data.eventId,
        serviceCenterId: data.serviceCenterId,
      },
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId));
        onSuccess();
      })
      .catch(e => {
        console.log('Update Customer Event error', e);
      });
  };

export const changeDealerOperationsPageData: ActionCreator<AppThunk> = (
  payload: Partial<IPageRequest>
) => {
  return async dispatch => {
    await dispatch(setCustomerCommunicationDashboardPageData(payload));
  };
};
