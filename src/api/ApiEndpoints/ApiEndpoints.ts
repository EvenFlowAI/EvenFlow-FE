import { IApiEndpoints, TApiEndpoint } from './types';
import { pathReplace } from '../../utils/utils';
import { AxiosResponse } from 'axios';
import { request } from '../request';
import { enqueueSnackbar } from 'notistack';
import { apiEndpoints } from './endpoints';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export type TOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  urlParams?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramsSerializer?: (params: any) => string;
};

export class Api {
  static endpoints: IApiEndpoints = apiEndpoints;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async call<RValue = any>(r: TApiEndpoint, options?: TOptions) {
    try {
      const path = pathReplace(r.route, options?.urlParams);
      if (r.method === 'post' || r.method === 'put' || r.method === 'patch') {
        return await request[r.method]<RValue, AxiosResponse<RValue>>(path, options?.data, {
          params: options?.params,
        });
      } else {
        return await request[r.method]<RValue, AxiosResponse<RValue>>(path, {
          params: options?.params,
          paramsSerializer: options?.paramsSerializer,
        });
      }
    } catch (err) {
      if (['DEV'].includes(process.env.REACT_APP_ENV ?? '')) {
        enqueueSnackbar(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).response?.data?.message || 'An error occurred while processing your request',
          {
            variant: 'error',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }
        );
      }
      throw err;
    }
  }
}
