import { TComplimentary } from './types';
import { AppThunk } from '../../../types/types';
import { loadComplimentary, getAllComplimentary } from '../packages/actions';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const addComplimentaryManually =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: TComplimentary, callback: () => void, errCallback: (err: any) => void): AppThunk =>
    dispatch => {
      Api.call(Api.endpoints.ComplimentaryServices.Create, { data })
        .then(result => {
          if (result) {
            dispatch(loadComplimentary(data.serviceCenterId));
            callback();
          }
        })
        .catch(err => {
          errCallback(err);
          console.log('add complimentary manually error', err);
        });
    };

export const editComplimentary =
  (
    id: number,
    data: TComplimentary,
    callback: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errCallback: (err: any) => void
  ): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.ComplimentaryServices.Update, { urlParams: { id }, data })
      .then(result => {
        if (result) {
          dispatch(loadComplimentary(data.serviceCenterId));
          callback();
        }
      })
      .catch(err => {
        errCallback(err);
        console.log('edit complimentary manually error', err);
      });
  };

export const addOpsCodeFromList =
  (
    serviceRequests: number[],
    serviceCenterId: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorCallback: (err: any) => void,
    successCallback = () => {}
  ): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.ComplimentaryServices.AddFromList, {
      data: { serviceCenterId, serviceRequests },
    })
      .then(result => {
        if (result) {
          successCallback();
          dispatch(loadComplimentary(serviceCenterId));
        }
      })
      .catch(err => {
        console.log('add op code to complimentary error', err);
        if (errorCallback) {
          errorCallback(err);
        }
      });
  };

export const loadAllComplimentary =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    const data = {
      serviceCenterId,
      pageIndex: 0,
      pageSize: 0,
    };
    Api.call(Api.endpoints.ComplimentaryServices.GetByQuery, { data })
      .then(result => {
        dispatch(getAllComplimentary(result.data.result));
      })
      .catch(err => {
        console.log(err);
      });
  };
