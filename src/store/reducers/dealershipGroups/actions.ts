import {
  DealershipActions,
  IDealershipGroupExtended,
  IDealershipGroupForm,
  IDealershipProfile,
  IDealershipProfileForm,
} from './types';
import { ThunkAction } from 'redux-thunk';
import { ActionCreator } from 'redux';
import {
  AppThunk,
  IPageRequest,
  IPagingResponse,
  PaginatedAPIResponse,
  TArgCallback,
  TCallback,
} from '../../../types/types';
import { RootState } from '../../rootReducer';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const loading = (payload: boolean): DealershipActions => ({
  type: 'Dealership/Loading',
  payload,
});

export const saving = (payload: boolean): DealershipActions => ({
  type: 'Dealership/Saving',
  payload,
});

const getAll = (payload: IDealershipGroupExtended[]): DealershipActions => ({
  type: 'Dealership/GetAll',
  payload,
});

const changePaging = (payload: IPagingResponse): DealershipActions => ({
  type: 'Dealership/ChangePaging',
  payload,
});

const _changePageData = (payload: Partial<IPageRequest>): DealershipActions => ({
  type: 'Dealership/ChangePageData',
  payload,
});

export const setSearchTerm = (payload: string): DealershipActions => ({
  type: 'Dealership/SetSearchTerm',
  payload,
});

export const setSidebarColorHex = (payload: string | undefined): DealershipActions => ({
  type: 'Dealership/SetSidebarColorHex',
  payload,
});

export const setCustomLogoPath = (payload: string | undefined): DealershipActions => ({
  type: 'Dealership/SetCustomLogoPath',
  payload,
});

export const changePageData: ActionCreator<
  ThunkAction<void, RootState, void, DealershipActions>
> = (payload: Partial<IPageRequest>) => {
  return async dispatch => {
    dispatch(_changePageData(payload));
    dispatch(loadAll());
  };
};

export const loadAll = (): AppThunk => (dispatch, getState) => {
  dispatch(loading(true));
  const state = getState();
  const { pageData, searchTerm } = state.dealershipGroups;
  const data = { ...pageData, searchTerm };
  Api.call<PaginatedAPIResponse<IDealershipGroupExtended>>(Api.endpoints.Dealerships.GetAll, {
    data,
  })
    .then(result => {
      if (result?.data) {
        const { result: dealerships, paging } = result.data;
        if (paging) {
          dispatch(changePaging(paging));
        }
        if (dealerships) {
          dispatch(getAll(dealerships));
        }
        dispatch(loading(false));
      }
    })
    .catch(err => {
      dispatch(loading(false));
      console.log('load all dealership', err);
    });
};

export const createDealership: ActionCreator<
  ThunkAction<void, RootState, void, DealershipActions>
> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: IDealershipGroupForm, onError: TArgCallback<any>, onSuccess: TArgCallback<number>) =>
    async dispatch => {
      dispatch(saving(true));
      const mappedData = {
        contactPerson: { ...data.contactPerson, phoneNumber: data.contactPerson.personPhoneNumber },
        dealership: { ...data.dealership, phoneNumber: data.dealership.dealershipPhoneNumber },
      };
      Api.call(Api.endpoints.Dealerships.Create, { data: mappedData })
        .then(res => {
          if (res?.data?.id) onSuccess(res.data.id);
          dispatch(loadAll());
        })
        .catch(err => {
          onError(err);
          console.log('create dealership error', err);
        })
        .finally(() => {
          dispatch(saving(false));
        });
    };

const _remove = (payload: number): DealershipActions => ({
  type: 'Dealership/Remove',
  payload,
});
export const remove: ActionCreator<ThunkAction<void, RootState, void, DealershipActions>> =
  (id: number) => async dispatch => {
    try {
      await Api.call(Api.endpoints.Dealerships.Remove, { urlParams: { id } });
      dispatch(_remove(id));
    } catch (e) {
      console.log('rempve dealership error', e);
    }
  };

const _loadDealershipProfile = (payload: IDealershipProfile): DealershipActions => ({
  type: 'Dealership/Profile',
  payload,
});
export const loadDealershipProfile = (): AppThunk => async dispatch => {
  try {
    const { data } = await Api.call<IDealershipProfile>(Api.endpoints.Accounts.Dealership);
    dispatch(_loadDealershipProfile(data));
  } catch (err) {
    console.log(err);
  }
};

export const updateDealership =
  (payload: IDealershipProfileForm, id: number): AppThunk =>
  async dispatch => {
    try {
      await Api.call(Api.endpoints.Dealerships.Update, { urlParams: { id }, data: payload });
      await dispatch(loadDealershipProfile());
    } catch (err) {
      console.log(err);
    }
  };

export const updateDealershipAvatar =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (avatar: File, id: number, onError: TArgCallback<any>, onSuccess?: TCallback): AppThunk =>
    async dispatch => {
      try {
        const data = new FormData();
        data.append('file', avatar, avatar.name);
        await Api.call(Api.endpoints.Dealerships.UploadAvatar, { urlParams: { id }, data });
        if (onSuccess) {
          onSuccess();
        }
        dispatch(loadDealershipProfile());
      } catch (err) {
        console.log(err);
        onError(err);
      }
    };

export const updateDealershipLogo =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (id: number, logo: File, onError: TArgCallback<any>): AppThunk =>
    async () => {
      try {
        const data = new FormData();
        data.append('file', logo, logo.name);
        await Api.call(Api.endpoints.Dealerships.UploadLogo, { urlParams: { id }, data });
      } catch (err) {
        console.log(err);
        onError(err);
      }
    };

export const updateLeftPanelColor =
  (id: number, hex: string): AppThunk =>
  () => {
    Api.call(Api.endpoints.Dealerships.UpdateSideBarColor, {
      urlParams: { id },
      data: { leftPanelColor: hex },
    });
  };
