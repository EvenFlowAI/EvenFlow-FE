import { createAction } from '@reduxjs/toolkit';
import { AppThunk, TArgCallback, TCallback } from '../../../types/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { ESettingType, IGeneralSetting } from './types';
import { setLaborType } from '../serviceRequests/actions';

export const getSettings = createAction<IGeneralSetting[]>('GeneralSettings/GetSettings');
export const setSettingsLoading = createAction<boolean>('GeneralSettings/SetLoading');

export const loadGeneralSettings =
  (serviceCenterId: number, settingTypes: ESettingType[]): AppThunk =>
  dispatch => {
    dispatch(setSettingsLoading(true));
    const params = new URLSearchParams();
    params.append('serviceCenterId', `${serviceCenterId}`);
    settingTypes.forEach(el => params.append('settingTypes', `${el}`));
    Api.call<IGeneralSetting[]>(Api.endpoints.GeneralSettings.Get, { params })
      .then(result => {
        if (result) {
          dispatch(getSettings(result.data));
          if (result.data[0].data.laborType) {
            dispatch(setLaborType(result.data[0].data.laborType));
          } else {
            dispatch(setLaborType(''));
          }
        }
      })
      .catch(err => {
        console.log('get general settings error', err);
      })
      .finally(() => {
        dispatch(setSettingsLoading(false));
      });
  };

export const updateGeneralSettings =
  (
    serviceCenterId: number,
    podId: number | null,
    data: IGeneralSetting[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: TArgCallback<any>,
    onSuccess: TCallback
  ): AppThunk =>
  dispatch => {
    dispatch(setSettingsLoading(true));
    Api.call<IGeneralSetting[]>(Api.endpoints.GeneralSettings.Update, { data })
      .then(result => {
        if (result) {
          dispatch(
            loadGeneralSettings(
              serviceCenterId,
              data.map(el => el.settingType)
            )
          );
          onSuccess();
        }
      })
      .catch(err => {
        console.log('get general settings error', err);
        onError(err);
      })
      .finally(() => {
        dispatch(setSettingsLoading(false));
      });
  };
