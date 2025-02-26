import { createAction } from '@reduxjs/toolkit';
import { AppThunk, PaginatedAPIResponse } from '../../../types/types';
import { IMake } from '../../../api/types';
import { ICreateMake, IEngineType, IMileage, TCreateEngineType, TCreateMileage } from './types';
import { loadAllSCs } from '../serviceCenters/actions';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { IPagingResponse, IOrder, IPageRequest } from '../../../types/types';
import { IGlobalMake, IGlobalModel } from '../globalVehicles/types';
export const getMakes = createAction<IMake[]>('VehicleDetails/GetMakes');
export const setCurrentMake = createAction<IMake | null>('VehicleDetails/SetCurrentMake');
export const setLoading = createAction<boolean>('VehicleDetails/SetLoading');
export const getMileage = createAction<IMileage[]>('VehicleDetails/GetMileage');
export const getEngineType = createAction<IEngineType[]>('VehicleDetails/EngineType');
export const setPaging = createAction<IPagingResponse>('VehicleDetails/SetPaging');
export const setPageData = createAction<IPageRequest>('VehicleDetails/SetPageData');
export const setMakeOrder = createAction<IOrder<IMake>>('VehicleDetails/SetMakeOrder');
export const setGlobalMakes = createAction<IGlobalMake[]>('VehicleDetails/SetGlobalMakes');
export const setGlobalModels = createAction<IGlobalModel[]>('VehicleDetails/SetGlobalModels');

export const loadMakes =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    const state = getState().vehicleDetails;
    dispatch(setLoading(true));
    Api.call<{ result: IMake[]; paging: IPagingResponse }>(Api.endpoints.Vehicles.Makes, {
      data: {
        serviceCenterId,
        orderBy: state.order.orderBy,
        isAscending: state.order.isAscending,
        pageIndex: state.pageData.pageIndex,
        pageSize: state.pageData.pageSize,
      },
    })
      .then(response => {
        if (response?.data) {
          dispatch(getMakes(response.data.result));
          dispatch(setPaging(response.data.paging));
        }
      })
      .catch(err => {
        console.log('load makes error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const loadMakesGlobally =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    const state = getState().vehicleDetails;
    dispatch(setLoading(true));
    Api.call<{ result: IMake[]; paging: IPagingResponse }>(Api.endpoints.Vehicles.Makes, {
      data: {
        serviceCenterId,
        orderBy: state.order.orderBy,
        isAscending: state.order.isAscending,
        pageIndex: 0,
        pageSize: 0,
      },
    })
      .then(response => {
        if (response?.data) {
          dispatch(getMakes(response.data.result));
          dispatch(setPaging(response.data.paging));
        }
      })
      .catch(err => {
        console.log('load makes error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const deleteMake =
  (makeId: number): AppThunk =>
  async (dispatch, getState) => {
    const { selectedSC } = getState().serviceCenters;
    if (selectedSC) {
      Api.call(Api.endpoints.Vehicles.RemoveMake, { urlParams: { id: makeId } })
        .then(result => {
          if (result) dispatch(loadMakes(selectedSC.id));
        })
        .catch(err => {
          console.log('remove make error', err);
        });
    }
  };

export const updateMake =
  (makeId: number, data: IMake): AppThunk =>
  async (dispatch, getState) => {
    const { selectedSC } = getState().serviceCenters;
    if (selectedSC) {
      Api.call(Api.endpoints.Vehicles.UpdateMake, { urlParams: { id: makeId }, data })
        .then(result => {
          if (result) dispatch(loadMakes(selectedSC.id));
        })
        .catch(err => {
          console.log('update make error', err);
        });
    }
  };

export const updateModel =
  (serviceCenterId: number, globalMakeId: number, globalIds: number[]): AppThunk =>
  async (dispatch, getState) => {
    const { selectedSC } = getState().serviceCenters;
    if (selectedSC) {
      Api.call(Api.endpoints.Vehicles.UpdateModel, {
        data: { serviceCenterId, globalMakeId, globalIds },
      })
        .then(result => {
          if (result) dispatch(loadMakes(selectedSC.id));
        })
        .catch(err => {
          console.log('update model error', err);
        });
    }
  };

export const createMake =
  (data: ICreateMake): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Vehicles.CreateMake, { data })
      .then(result => {
        if (result) dispatch(loadMakes(data.serviceCenterId));
      })
      .catch(err => {
        console.log('update make error', err);
      });
  };

export const loadMileage =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));
    Api.call<IMileage[]>(Api.endpoints.Vehicles.GetMileage, { params: { serviceCenterId } })
      .then(result => {
        if (result?.data) {
          dispatch(getMileage(result.data));
        }
      })
      .catch(err => {
        console.log('load mileage error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const createMileage =
  (data: TCreateMileage): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Vehicles.CreateMileage, { data })
      .then(result => {
        if (result?.data) {
          dispatch(loadMileage(data.serviceCenterId));
        }
      })
      .catch(err => {
        console.log('create mileage error', err);
      });
  };

export const removeMileage =
  (
    id: number,
    serviceCenterId: number,
    onRemoveSuccess: () => void,
    onError: (e: string) => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Vehicles.RemoveMileage, { urlParams: { id } })
      .then(result => {
        if (result?.data) {
          dispatch(loadMileage(serviceCenterId));
          onRemoveSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('remove mileage error', err);
      });
  };


export const loadEngineType =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Vehicles.GetEngineType, { params: { serviceCenterId } })
      .then(result => {
        if (result?.data) {
          dispatch(getEngineType(result.data));
        }
      })
      .catch(err => {
        console.log('load engine type error', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const removeEngineType =
  (
    id: number,
    serviceCenterId: number,
    onRemove: () => void,
    onError: (e: string) => void
  ): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Vehicles.RemoveEngineType, { urlParams: { id } })
      .then(result => {
        if (result?.data) {
          dispatch(loadEngineType(serviceCenterId));
          onRemove();
        }
      })
      .catch(err => {
        onError(err);
        console.log('remove engine type error', err);
      });
  };

export const createEngineType =
  (data: TCreateEngineType, onError: (err: string) => void): AppThunk =>
  async dispatch => {
    Api.call(Api.endpoints.Vehicles.CreateEngineType, { data })
      .then(result => {
        if (result?.data) {
          dispatch(loadEngineType(data.serviceCenterId));
        }
      })
      .catch(err => {
        onError(err);
        console.log('create engine type error', err);
      });
  };

export const updateEngineTypeFieldName =
  (
    engineTypeFieldName: string,
    id: number,
    onSuccess: () => void,
    onError: (err: string) => void
  ): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.ServiceCenters.UpdateEngineTypeFieldName, {
      urlParams: { id },
      data: { engineTypeFieldName },
    })
      .then(result => {
        if (result.data) {
          dispatch(loadAllSCs());
          onSuccess();
        }
      })
      .catch(err => {
        onError(err);
        console.log('update engine type field name error');
      });
  };

export const loadGlobalMakes = (): AppThunk => async dispatch => {
  Api.call<PaginatedAPIResponse<IGlobalMake>>(Api.endpoints.GlobalVehicles.GetMakes, {
    data: {
      pageIndex: 0,
      pageSize: 0,
      isAscending: true,
      showStandardized: true,
    },
  })
    .then(result => {
      if (result?.data) {
        dispatch(setGlobalMakes(result.data.result));
      }
    })
    .catch(err => {
      console.log('load global makes error', err);
    });
};

export const loadGlobalModels =
  (makeId: number): AppThunk =>
  async dispatch => {
    Api.call<PaginatedAPIResponse<IGlobalModel>>(Api.endpoints.GlobalVehicles.GetModels, {
      data: {
        pageIndex: 0,
        pageSize: 0,
        isAscending: true,
        showStandardized: true,
        makeIds: [makeId],
      },
    })
      .then(result => {
        if (result?.data) {
          dispatch(setGlobalModels(result.data.result));
        }
      })
      .catch(err => {
        console.log('load global models error', err);
      });
  };
