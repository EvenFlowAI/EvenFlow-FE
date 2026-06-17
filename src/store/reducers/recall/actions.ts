/* eslint-disable max-lines */

import { createAction } from '@reduxjs/toolkit';
import {
  ICreateUpdateRecall,
  IGlobalModelYear,
  IRecall,
  IRecallAffectedModel,
  IRecallAlert,
  IRecallCampaign,
  IRecallResponse,
  TRecallRequest,
  TUpdateRecall,
} from './types';
import {
  AppThunk,
  IOrder,
  IPageRequest,
  IRecallByVin,
  TArgCallback,
  TCallback,
  TOption,
} from '../../../types/types';
import { setSelectedRecalls } from '../appointmentFrameReducer/actions';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import queryString from 'query-string';
import { ComparisonOperatorE, EventRulesFilterTypeE } from '../dealerOperations/actions';
import { TriggerI } from '../../../pages/admin/DealerOperations/Customer/types';
import { HistoryRecallData } from '../../../pages/admin/DealerOperations/Customer/RecallAlerts/layouts/HistoryRecall';

export const getRecalls = createAction<IRecall[]>('Recall/GetRecalls');
export const setRecallAlerts = createAction<IRecallAlert[]>('Recall/SetRecallAlert');
export const setLoading = createAction<boolean>('Recall/SetLoading');
export const setRecallPageData = createAction<Partial<IPageRequest>>('Recall/SetRecallPageData');
export const setRecallAlertsPageData = createAction<Partial<IPageRequest>>(
  'Recall/SetRecallAlertsPageData'
);
export const setRecallsCount = createAction<number>('Recall/SetRecallsCount');
export const setRecallAlertsCount = createAction<number>('Recall/SetRecallAlertsCount');
export const getRecallsByVin = createAction<IRecallByVin[]>('Recall/GetRecallsByVin');
export const setRecallOrder = createAction<IOrder<IRecall>>('Recall/SetOrder');
export const setRecallAlertsOrderStats = createAction<IOrder<IRecallAlert>>(
  'Recall/SetRecallAlertOrderStats'
);
export const setRecallAlertsOrderWorkflow = createAction<IOrder<IRecallAlert>>(
  'Recall/SetRecallAlertsOrderWorkflow'
);
export const setRecallSearch = createAction<string>('Recall/SetSearch');
export const setRecallCampaignInfo = createAction<IRecallCampaign[]>(
  'Recall/SetRecallCampaignInfo'
);
export const setSelectedStatus = createAction<TOption>('Recall/SetSelectedStatus');
export const setUpdatedAlerts = createAction<
  {
    id: number;
    name: string;
  }[]
>('Recall/SetUpdatedAlerts');
export const setIsEditName = createAction<boolean>('Recall/SetIsEditName');
export const setIsRecallAlertsTableLoading = createAction<boolean>(
  'Recall/SetIsRecallAlertsTableLoading'
);
export const setSelectedRecallAlert = createAction<IRecallAlert | null>(
  'Recall/SetSelectedRecallAlert'
);
export const setAffectedModels = createAction<IRecallAffectedModel[]>('Recall/SetAffectedModels');

export const loadRecalls =
  (serviceCenterId: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(setLoading(true));
    const { recallPageData, order, searchTerm } = getState().recalls;
    const { pageSize, pageIndex } = recallPageData;
    const data: TRecallRequest = {
      serviceCenterId,
      pageSize,
      pageIndex,
      searchTerm,
    };
    if (order) {
      data.orderBy = order.orderBy;
      data.isAscending = order.isAscending;
    }
    Api.call<IRecallResponse>(Api.endpoints.Recalls.GetAll, { data })
      .then(result => {
        if (result.data?.result) {
          dispatch(
            getRecalls(result.data.result.map((el, index) => ({ ...el, localIndex: index })))
          );
          dispatch(setRecallsCount(result.data.paging.numberOfRecords));
        }
      })
      .catch(err => {
        console.log('get recalls err', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const createRecall =
  (data: ICreateUpdateRecall, onError: (err: string) => void, onSuccess: () => void): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Create, { data })
      .then(result => {
        if (result) {
          dispatch(loadRecalls(data.serviceCenterId));
          onSuccess();
        }
      })
      .catch(err => {
        console.log('create recall err', err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const updateRecall =
  (
    data: ICreateUpdateRecall,
    id: number,
    onError: (err: string) => void,
    onSuccess: () => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Update, { urlParams: { id }, data })
      .then(result => {
        if (result) {
          dispatch(loadRecalls(data.serviceCenterId));
          onSuccess();
        }
      })
      .catch(err => {
        console.log('update recall err', err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const deleteRecall =
  (id: number, serviceCenterId: number, onError: (err: string) => void): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Remove, { urlParams: { id }, params: { serviceCenterId } })
      .then(result => {
        if (result) dispatch(loadRecalls(serviceCenterId));
      })
      .catch(err => {
        console.log('delete recall err', err);
        onError(err);
        dispatch(setLoading(false));
      });
  };

export const loadRecallsByVin =
  (serviceCenterId: number, vin: string, make: string, model: string, year: number): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.GetByVin, {
      data: { serviceCenterId, vin: vin.toUpperCase(), make, model, year },
    })
      .then(result => {
        if (result.data) dispatch(getRecallsByVin(result.data));
      })
      .catch(err => {
        console.log('get recalls by vin err', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updateSelectedRecalls =
  (
    serviceCenterId: number,
    vin: string,
    make: string,
    model: string,
    year: number,
    recallsNumbers: string[]
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.GetByVin, {
      data: { serviceCenterId, vin: vin.toUpperCase(), make, model, year },
    })
      .then(result => {
        if (result.data) {
          const data: IRecallByVin[] = result.data;
          dispatch(getRecallsByVin(data));
          const selected = data.filter(item => {
            return item.campaignNumber
              ? recallsNumbers.includes(item.campaignNumber)
              : item.oemProgram && recallsNumbers.includes(item.oemProgram);
          });
          dispatch(setSelectedRecalls(selected));
        }
      })
      .catch(err => {
        console.log('set update selected recalls err', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const updatePartsAvailability =
  (
    serviceCenterId: number,
    data: TUpdateRecall[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: TArgCallback<any>,
    onSuccess: TCallback
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.UpdateRecallParts, {
      data: { serviceCenterId, recallParts: data },
    })
      .then(res => {
        if (res) dispatch(loadRecalls(serviceCenterId));
        onSuccess();
      })
      .catch(err => {
        onError(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const getRecallEvents =
  (
    serviceCenterId: number,
    tableType: 'workflow' | 'stats',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: TArgCallback<any>,
    onSuccess: TCallback
  ): AppThunk =>
  (dispatch, getState) => {
    const {
      recallAlertsPageData,
      recallAlertsOrderStats,
      recallAlertsOrderWorkflow,
      selectedStatus,
      selectedRecallAlert,
    } = getState().recalls;
    const { pageSize, pageIndex } = recallAlertsPageData;
    const data: TRecallRequest = {
      serviceCenterId,
      pageSize,
      pageIndex,
      status: selectedStatus.value,
    };
    if (tableType === 'workflow') {
      data.orderBy = recallAlertsOrderWorkflow.orderBy;
      data.isAscending = recallAlertsOrderWorkflow.isAscending;
    }
    if (tableType === 'stats') {
      data.orderBy = recallAlertsOrderStats.orderBy;
      data.isAscending = recallAlertsOrderStats.isAscending;
    }
    dispatch(setIsRecallAlertsTableLoading(true));
    Api.call(Api.endpoints.Recalls.GetRecallEvents, { params: { ...data } })
      .then(response => {
        const recallEvents = response?.data?.data;
        const paging = response?.data?.meta?.paging;
        if (recallEvents?.length && paging) {
          const ids = (recallEvents || [])
            .map((item: IRecallAlert) => item.recallCampaignId)
            .filter((id: number | undefined | null) => id !== undefined && id !== null);

          if (ids.length > 0) {
            return Api.call(Api.endpoints.GlobalRecalls.GetGlobalRecalls, {
              params: { recallCampaignIds: ids },
              paramsSerializer: params => queryString.stringify(params, { arrayFormat: 'none' }),
            }).then(res => {
              const enriched = recallEvents.map((alert: IRecallAlert) => {
                const extra = res.data.data.find(
                  (item: IRecallCampaign) => item.id === alert.recallCampaignId
                );
                return {
                  ...alert,
                  nhtsaCampaign: extra?.nhtsaCampaign,
                  recallComponent: extra?.recallComponent,
                };
              });

              dispatch(setRecallAlerts(enriched));
              dispatch(setRecallAlertsCount(paging.total));
              dispatch(setIsRecallAlertsTableLoading(false));
              if (selectedRecallAlert) {
                dispatch(
                  setSelectedRecallAlert(
                    enriched.find((el: IRecallAlert) => el.id === selectedRecallAlert.id) || null
                  )
                );
              }
              onSuccess();
            });
          } else {
            dispatch(setRecallAlerts(recallEvents));
            dispatch(setRecallAlertsCount(paging.total));
            dispatch(setIsRecallAlertsTableLoading(false));
            onSuccess();
          }
        } else {
          dispatch(setRecallAlerts([]));
          dispatch(setRecallAlertsCount(0));
          dispatch(setIsRecallAlertsTableLoading(false));
          onSuccess();
        }
      })
      .catch(err => {
        dispatch(setIsRecallAlertsTableLoading(false));
        onError(err);
      });
  };

export const createRecallAlert =
  (
    data: { serviceCenterId: number; name: string },
    tableType: 'workflow' | 'stats',
    onClose: () => void,
    onError?: () => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Recalls.CreateRecallEvent, {
      data,
    })
      .then(() => {
        dispatch(
          getRecallEvents(
            data.serviceCenterId,
            tableType,
            () => {},
            () => {}
          )
        );
        onClose();
      })
      .catch(e => {
        if (onError) onError();
        console.log('Creating Recall Alert error', e);
      });
  };

export const updateRecallAlertName =
  (
    data: {
      id: number;
      name: string;
      serviceCenterId: number;
    },
    tableType: 'workflow' | 'stats',
    onSuccess: () => void,
    onError?: (eventName: string) => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Recalls.UpdateRecallEvent, {
      urlParams: { id: data.id },
      data: { ...data },
    })
      .then(() => {
        dispatch(getRecallEvents(data.serviceCenterId, tableType, () => {}, onSuccess));
      })
      .catch(e => {
        if (onError) onError(data.name);
        console.log('Update Recall Alert error', e);
      });
  };

export const deleteRecallAlert =
  (
    serviceCenterId: number,
    recallId: number,
    tableType: 'workflow' | 'stats',
    onSuccess: () => void,
    onError?: (message: string) => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Recalls.DeleteRecallEvent, {
      urlParams: { id: recallId },
    })
      .then(() => {
        dispatch(getRecallEvents(serviceCenterId, tableType, () => {}, onSuccess));
      })
      .catch(e => {
        if (onError) onError('Delete Recall Alert error');
        console.log('Delete Recall Alert error', e);
      });
  };

export const updateRecallAlert =
  (
    data: {
      id: number;
      listType?: number;
      recallCampaignId?: number;
      serviceCenterId: number;
      filterRules?: {
        id?: number;
        type: string;
        operator: string;
        value: string;
        isCriteria?: boolean;
      }[];
      triggers: TriggerI[];
      globalModels: IGlobalModelYear[] | null;
    },
    onSuccess: () => void,
    handleUploadFile?: (callback: TCallback) => void,
    onError?: (error: string) => void
  ): AppThunk =>
  async dispatch => {
    const filterRules = data.filterRules?.map(el => {
      return {
        ...el,
        type: EventRulesFilterTypeE[el.type as keyof typeof EventRulesFilterTypeE],
        operator: ComparisonOperatorE[el.operator as keyof typeof ComparisonOperatorE],
        value: el.value || '0',
      };
    });

    Api.call(Api.endpoints.Recalls.UpdateRecallEvent, {
      urlParams: { id: data.id },
      data: { ...data, filterRules },
    })
      .then(() => {
        if (handleUploadFile) {
          handleUploadFile(() => {
            dispatch(getRecallEvents(data.serviceCenterId, 'workflow', () => {}, onSuccess));
          });
        } else {
          dispatch(getRecallEvents(data.serviceCenterId, 'workflow', () => {}, onSuccess));
        }
      })
      .catch(e => {
        const backendMessage =
          e?.response?.data?.error?.message ||
          e.message ||
          'Something went wrong. Please try again later.';

        if (onError) onError(backendMessage);
        console.log('Update Recall Alert error', e);
      });
  };

export const uploadCSV =
  (id: number, file: File, onSuccess: () => void, onError?: (text: string) => void): AppThunk =>
  async () => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    Api.call(Api.endpoints.Recalls.UploadCSV, {
      urlParams: { id },
      data: fd,
    })
      .then(() => {
        onSuccess();
      })
      .catch(err => {
        const backendMessage =
          err?.response?.data?.error?.message || err.message || 'Unknown error';
        if (onError) onError(backendMessage);
        console.log('Update Recall Alert error', err);
      });
  };

export const getAffectedModels =
  (
    campaignId: number,
    serviceCenterId: number,
    onSuccess: () => void,
    onError?: () => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.GlobalRecalls.GetAffectedModels, {
      urlParams: { campaignId },
      params: { serviceCenterId },
    })
      .then(r => {
        if (r?.data?.data?.affectedModels?.length) {
          dispatch(setAffectedModels(r.data.data.affectedModels));
        } else {
          dispatch(setAffectedModels([]));
        }
        onSuccess();
      })
      .catch(e => {
        if (onError) onError();
        console.log('Update Recall Alert error', e);
      });
  };

export const updateRecallAlertText =
  (
    data: {
      id: number;
      communicationDetails: {
        textMessage: string;
      };
      serviceCenterId: number;
    },
    tableType: 'workflow' | 'stats',
    onSuccess: () => void,
    onError?: (eventName: string) => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Recalls.UpdateRecallEvent, {
      urlParams: { id: data.id },
      data: { ...data },
    })
      .then(() => {
        onSuccess();
        dispatch(
          getRecallEvents(
            data.serviceCenterId,
            tableType,
            () => {},
            () => {}
          )
        );
      })
      .catch(e => {
        if (onError) onError('');
        console.log('Update Recall Alert error', e);
      });
  };

export const checkVins =
  (id: number, onSuccess: () => void, onError?: (eventName: string) => void): AppThunk =>
  async () => {
    Api.call(Api.endpoints.Recalls.RecallTrigger, {
      urlParams: { id },
      data: {},
    })
      .then(() => {
        onSuccess();
      })
      .catch(e => {
        const backendMessage = e?.response?.data?.message || e.message || 'Unknown error';
        if (onError) onError(backendMessage);
      });
  };

export const viewHistoryData =
  (
    entityId: number,
    onSuccess: (data: HistoryRecallData[]) => void,
    onError?: () => void
  ): AppThunk =>
  async () => {
    const params = {
      entityType: 'recallEvent',
      propertyNames: 'status',
      entityId,
    };

    Api.call(Api.endpoints.Audit.History, { params })
      .then(response => {
        if (response?.data?.data?.history.length) {
          onSuccess(response?.data?.data?.history);
        } else {
          onSuccess([]);
        }
      })
      .catch(e => {
        if (onError) onError();
        console.log('viewHistoryData error', e);
      });
  };
