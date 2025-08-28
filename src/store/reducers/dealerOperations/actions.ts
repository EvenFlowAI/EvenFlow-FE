import { createAction } from '@reduxjs/toolkit';
import { DashboardItemI } from './types';
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

export enum EventAudienceFilterTypeE {
  DaysToFutureAppointment = 1,
}

export enum EventRulesFilterTypeE {
  DaysFromLastNoShowAppointment = 1,
  DaysFromLastCancelAppointment,
  DaysFromLastShowedAppointment,
  DaysFromLastOpenRo,
  DaysFromLastClosedRo,
}

export enum ComparisonOperatorE {
  'Less than',
  'Equal',
  'Greater than',
}

export const loadDashboardItems =
  (serviceCenterId: number): AppThunk =>
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
      })
      .catch(e => {
        console.log('Loading dashboard items error', e);
      });
  };

export const createCustomerEvent =
  (data: { serviceCenterId: number; name: string }, onClose: () => void): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.CreateEvent, {
      data,
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId));
        onClose();
      })
      .catch(e => {
        console.log('Creating Customer Event error', e);
      });
  };

export const deleteCustomerEvent =
  (data: { serviceCenterId: number; id: number }): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.DeleteEvent, { urlParams: { id: data.id } })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId));
      })
      .catch(e => {
        console.log('Deleting Customer Event error', e);
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
              textFrom: string;
              textMessage: string;
            };
          }
        | { isTextEnabled: boolean };
    },
    onClear: () => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.DealerOperations.UpdateEvent, {
      urlParams: { id: data.eventId },
      data: { ...data.updatedData, id: data.eventId, serviceCenterId: data.serviceCenterId },
    })
      .then(() => {
        dispatch(loadDashboardItems(data.serviceCenterId));
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
