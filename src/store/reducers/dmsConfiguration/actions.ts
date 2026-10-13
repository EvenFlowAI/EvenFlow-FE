import { createAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../../types/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { getAPIException } from '../../../utils/utils';
import { getFileNameFromContentDisposition } from '../../../utils/headerUtils';
import {
  ICreateDmsServiceRequestsPayload,
  ICreateDmsServiceRequestsResult,
  IDmsConfiguration,
  IDmsConfigurationApiResponse,
  IDmsConfigurationQuery,
} from './types';

export const setDmsConfigurationLoading = createAction<boolean>('DmsConfiguration/SetLoading');
export const setDmsConfiguration = createAction<IDmsConfiguration | null>(
  'DmsConfiguration/SetConfiguration'
);
export const setDmsConfigurationQuery = createAction<IDmsConfigurationQuery | null>(
  'DmsConfiguration/SetQuery'
);

// Only the latest request may update the store; reset or a newer query invalidates older ones.
let latestRequestId = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDmsConfigurationError = (err: any): string =>
  err?.response?.data?.error?.message || getAPIException(err);

const fetchDmsConfiguration = async (query: IDmsConfigurationQuery): Promise<IDmsConfiguration> => {
  const { data: response } = await Api.call<IDmsConfigurationApiResponse<IDmsConfiguration>>(
    Api.endpoints.DmsConfiguration.Get,
    { params: query }
  );
  if (!response?.isSuccess) {
    throw new Error(response?.error?.message || 'Failed to retrieve DMS configuration.');
  }
  return {
    serviceRequests: response.data?.serviceRequests ?? [],
    employees: response.data?.employees ?? [],
    transportations: response.data?.transportations ?? [],
  };
};

export const resetDmsConfiguration = (): AppThunk => dispatch => {
  latestRequestId += 1;
  dispatch(setDmsConfiguration(null));
  dispatch(setDmsConfigurationQuery(null));
  dispatch(setDmsConfigurationLoading(false));
};

export const loadDmsConfiguration =
  (query: IDmsConfigurationQuery, onError: (message: string) => void): AppThunk =>
  async dispatch => {
    const requestId = ++latestRequestId;
    const isLatest = () => requestId === latestRequestId;

    dispatch(setDmsConfiguration(null));
    dispatch(setDmsConfigurationQuery(null));
    dispatch(setDmsConfigurationLoading(true));
    try {
      const configuration = await fetchDmsConfiguration(query);
      if (!isLatest()) return;
      dispatch(setDmsConfigurationQuery(query));
      dispatch(setDmsConfiguration(configuration));
    } catch (err) {
      if (isLatest()) onError(getDmsConfigurationError(err));
    } finally {
      if (isLatest()) dispatch(setDmsConfigurationLoading(false));
    }
  };

export const importDmsOpCodes =
  (
    codes: string[],
    onSuccess: (result: ICreateDmsServiceRequestsResult) => void,
    onError: (message: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    const { query } = getState().dmsConfiguration;
    if (!query || !codes.length) {
      onError('Select op codes to add.');
      return;
    }
    const requestId = latestRequestId;
    const payload: ICreateDmsServiceRequestsPayload = { ...query, codes };

    try {
      const { data: response } = await Api.call<
        IDmsConfigurationApiResponse<ICreateDmsServiceRequestsResult>
      >(Api.endpoints.DmsConfiguration.CreateServiceRequests, { data: payload });
      if (!response?.isSuccess) {
        onError(response?.error?.message || 'Failed to add op codes.');
        return;
      }
      onSuccess(response.data ?? { inserted: 0, updated: 0, failed: 0 });
    } catch (err) {
      onError(getDmsConfigurationError(err));
      return;
    }

    // Refresh statuses in place unless the user has started a different query meanwhile.
    if (requestId !== latestRequestId) return;
    const refreshId = ++latestRequestId;
    try {
      const configuration = await fetchDmsConfiguration(query);
      if (refreshId === latestRequestId) dispatch(setDmsConfiguration(configuration));
    } catch (err) {
      if (refreshId === latestRequestId) onError(getDmsConfigurationError(err));
    }
  };

export const downloadDmsConfigurationCsv =
  (onError: (message: string) => void, onFinish?: () => void): AppThunk =>
  async (_, getState) => {
    const { query } = getState().dmsConfiguration;
    if (!query) {
      onError('Run a query before downloading.');
      onFinish?.();
      return;
    }
    try {
      const response = await Api.call<BlobPart>(Api.endpoints.DmsConfiguration.GetCsv, {
        params: query,
      });
      const contentType = response.headers['content-type'] || 'text/csv';
      const fileName =
        getFileNameFromContentDisposition(response.headers['content-disposition']) ??
        `dms-configuration-${query.makeId}-${query.modelId}${query.year ? `-${query.year}` : ''}.csv`;

      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      onError(getDmsConfigurationError(err));
    } finally {
      onFinish?.();
    }
  };
