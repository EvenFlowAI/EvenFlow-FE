/* eslint-disable max-lines */
/* eslint-disable complexity */

import { createAction } from '@reduxjs/toolkit';
import {
  APPOINTMENT_STATE_KEY,
  APPOINTMENT_STATE_SAVED_KEY,
  EAppointmentTimingType,
  IAppointmentFilters,
  IAppointmentResponse,
  IAppointmentSlot,
  IAppointmentSlotsRequest,
  IDropOffSettings,
  IPersonalInformation,
  IPrivacy,
  IRemappedAppointmentSlot,
  IReminders,
  ISearchedDateRange,
  IServiceCenterProfile,
  IServiceValetAppointment,
  ISR,
  ISVAppointmentResponse,
  IWaitListData,
  TAppointmentState,
} from './types';
import {
  AppThunk,
  PaginatedAPIResponse,
  ParsableDate,
  TArgCallback,
  TCallback,
  TParsableDate,
} from '../../../types/types';
import {
  ICreateAppointmentResp,
  ICustomerLoadedData,
  ILoadedVehicle,
  IServiceCategory,
  IServiceCategoryShort,
} from '../../../api/types';
import {
  getSlotsGap,
  setTiming,
  setTime,
  setInitialTiming,
} from '../appointmentFrameReducer/actions';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DealershipsIds } from '../../../utils/constants';

export const setProfileLoading = createAction<boolean>('Appointment/SetProfileLoading');
export const setTopAligning = createAction<boolean>('Appointment/SetTopAligning');
export const getServiceCenterProfile = createAction<IServiceCenterProfile>(
  'Appointment/GetSCProfile'
);
export const loadSCProfile =
  (id: number): AppThunk =>
  async dispatch => {
    dispatch(setProfileLoading(true));
    try {
      const { data } = await Api.call<IServiceCenterProfile>(
        Api.endpoints.ServiceCenters.Retrieve,
        { urlParams: { id } }
      );
      dispatch(getServiceCenterProfile(data));
      const shouldBeTopAligned =
        DealershipsIds.Fremont.includes(data?.dealershipId) ||
        DealershipsIds.LakePowellFord.includes(data?.dealershipId) ||
        DealershipsIds.Dealerbuilt.includes(data?.dealershipId) ||
        DealershipsIds.Bountiful.includes(data?.dealershipId) ||
        DealershipsIds.Walser.includes(data?.dealershipId) ||
        DealershipsIds.TomWoodVW.includes(data?.dealershipId);

      dispatch(setTopAligning(shouldBeTopAligned));
    } catch (err) {
      console.log('load sc profile err', err);
    } finally {
      await dispatch(setProfileLoading(false));
    }
  };
export const getSRs = createAction<ISR[]>('Appointment/GetSRs');
export const loadSRs =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const {
        data: { result },
      } = await Api.call<PaginatedAPIResponse<ISR>>(Api.endpoints.ServiceRequests.GetShort, {
        params: {
          serviceCenterId,
          pageSize: 0,
          searchTerm: getState().appointment.search,
          isOnlyIndividual: true,
        },
      });
      dispatch(getSRs(result));
    } catch (err) {
      console.log('load sr list err', err);
    }
  };
export const selectSR = createAction<number | null>('Appointment/SelectSR');
export const selectSRMultiple = createAction<{ ids: number[]; comments: Record<number, string> }>(
  'Appointment/SelectSRMultiple'
);
export const selectSRComments = createAction<{ comments: Record<number, string> }>(
  'Appointment/SelectSRComments'
);
export const selectSRComment = createAction<{ comments: Record<number, string> }>(
  'Appointment/SelectSRComment'
);

export const handleSearch = createAction<string>('Appointment/Search');
export const changeReminders = createAction<Partial<IReminders>>('Appointment/ChangeReminders');
export const changePrivacy = createAction<Partial<IPrivacy>>('Appointment/ChangePrivacy');
export const changePersonalInformation = createAction<Partial<IPersonalInformation>>(
  'Appointment/ChangePersonalInformation'
);
export const selectAppointment = createAction<IRemappedAppointmentSlot | null>(
  'Appointment/SelectAppointment'
);
export const selectServiceValetAppointment = createAction<IServiceValetAppointment | null>(
  'Appointment/SelectServiceValetAppointment'
);
export const getServiceCategories = createAction<IServiceCategory[]>(
  'Appointment/GetServiceCategories'
);
export const getAllServiceCategories = createAction<IServiceCategoryShort[]>(
  'Appointment/GetAllServiceCategories'
);
// export const setLoadedDateRange = createAction<ISearchedDateRange>(
//   'Appointment/SetLoadedDateRange'
// );
export const getAppointmentSlots = createAction<IAppointmentSlot[]>(
  'Appointment/GetAppointmentSlots'
);
export const setAppointmentWasChanged = createAction<boolean>(
  'Appointment/SetAppointmentWasChanged'
);
export const setWaitListSettings = createAction<IWaitListData | null>(
  'Appointment/SetWaitListSettings'
);
export const setSlotPodId = createAction<number | null>('Appointment/SetSlotPodId');
export const setSlotsLoading = createAction<boolean>('Appointment/setSlotsLoading');
export const setSlotsServiceTypeOptionId = createAction<number | null>(
  'Appointment/SetSlotsServiceTypeOptionId'
);
export const setSlotsTransportationId = createAction<number | null>(
  'Appointment/SetSlotsTransportationId'
);
export const setSlotsSearchDate = createAction<ParsableDate>(
  'Appointment/SetSlotsServiceSearchDate'
);
export const setIsCloneMode = createAction<boolean>('Appointment/setIsCloneMode');

export const setLoadedDateRange = createAction<ISearchedDateRange>(
  'Appointment/SetLoadedDateRange'
);

export const loadAppointmentSlots =
  (
    data: IAppointmentSlotsRequest,
    cb?: (d: TParsableDate) => void,
    loadCB?: TCallback,
    onLoadedCb?: (isEmptyList: boolean) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: TArgCallback<any>,
    setApiDates?: (newStartDate: string) => void
  ): AppThunk =>
  async dispatch => {
    dispatch(setSlotsLoading(true));
    try {
      const {
        data: { items, slotGapMinutes, waitlistSettings, podId, searchedDateRange },
      } = await Api.call<IAppointmentResponse>(Api.endpoints.AppointmentSlots.GetSlots, { data });
      const res = dispatch(
        getAppointmentSlots(
          items.map(item => {
            const searchDate = data.fromDate || data.startDate;
            return {
              ...item,
              searchDate: searchDate as TParsableDate,
            };
          })
        )
      );
      if (data.appointmentTimingType === EAppointmentTimingType.FirstAvailable) {
        const nearestDate = items.find(item => {
          const slotDateTime = dayjs(`${item.date}T${item.time}`);
          return slotDateTime.isAfter(dayjs());
        });
        const date = dayjs(nearestDate?.date as TParsableDate);
        dispatch(setTiming(EAppointmentTimingType.PreferredDate));
        dispatch(setInitialTiming(EAppointmentTimingType.FirstAvailable));
        dispatch(setTime(date as TParsableDate));
        dispatch(setSlotsSearchDate(items[0].date as TParsableDate));
      }
      // if (data.appointmentTimingType === EAppointmentTimingType.PreferredDate) {
      //   const nearestDate = items.find(item => dayjs(item.date as TParsableDate).isAfter(dayjs()));
      //   const date = dayjs(nearestDate?.date as TParsableDate);
      //   dispatch(setTime(date as TParsableDate));
      // }
      if (items.length > 0 && data.startDate && data.endDate && setApiDates) {
        const firstSlotDate = dayjs(String(items[0].date));
        const startDate = dayjs(String(data.startDate));
        const endDate = dayjs(String(data.endDate));
        if (firstSlotDate.isAfter(endDate) || firstSlotDate.isBefore(startDate)) {
          console.log('!!!!! IS AFTER OR BEFORE');
          setApiDates(String(items[0].date));
        }
      }
      if (slotGapMinutes) dispatch(getSlotsGap(slotGapMinutes));
      dispatch(setWaitListSettings(waitlistSettings ?? null));
      dispatch(setSlotPodId(podId ?? null));
      if (loadCB) {
        loadCB();
      }
      if (onLoadedCb) {
        onLoadedCb(!items.length);
      }
      if (searchedDateRange) {
        dispatch(setLoadedDateRange(searchedDateRange));
      }
      dispatch(setSlotsServiceTypeOptionId(data.serviceTypeOptionId ?? null));
      dispatch(setSlotsTransportationId(data.transportationOptionId ?? null));
      const searchDate = data.fromDate || data.startDate;
      dispatch(setSlotsSearchDate(searchDate as TParsableDate));
      if (
        cb &&
        data.appointmentTimingType === EAppointmentTimingType.FirstAvailable &&
        searchedDateRange
      ) {
        return cb(dayjs.utc(searchedDateRange.from));
      }
      return res;
    } catch (err) {
      console.log('error');
      if (onError) {
        onError(err);
      }
      if (onLoadedCb) {
        onLoadedCb(true);
      }
      dispatch(setSlotsServiceTypeOptionId(null));
      dispatch(setSlotsTransportationId(null));
      dispatch(setSlotsSearchDate(null));
      dispatch(setSlotPodId(null));
      return dispatch(getAppointmentSlots([]));
    } finally {
      dispatch(setSlotsLoading(false));
    }
  };
export const setLoadedReducer = createAction<TAppointmentState>('Appointment/ReloadState');
export const saveAppointmentReducer = (): AppThunk => (d, getState) => {
  const state = JSON.stringify({ ...getState().appointment });
  localStorage.setItem(APPOINTMENT_STATE_KEY, state);
  localStorage.setItem(APPOINTMENT_STATE_SAVED_KEY, dayjs().toISOString());
};
export const clearStorage = () => {
  localStorage.removeItem(APPOINTMENT_STATE_KEY);
  localStorage.removeItem(APPOINTMENT_STATE_SAVED_KEY);
};

export const setOldAppointmentId = createAction<ICreateAppointmentResp & { updated: boolean }>(
  'Appointments/SetAppointmentId'
);
export const setAppointmentFilters =
  createAction<Partial<IAppointmentFilters>>('Appointment/SetFilters');
export const setCustomerEnteredEmail = createAction<string>('Appointment/SetCustomerEnteredEmail');
export const setCustomerLoadedData = createAction<ICustomerLoadedData | null>(
  'Appointment/SetCustomerLoadedData'
);

export const setSessionId = createAction<string>('Appointment/SetSessionId');
export const setEditAppointment = createAction<TAppointmentState>('Appointment/SetEditAppointment');

const CUSTOMER_CACHE = 'fCC';
export const saveCustomerCache = (data: ICustomerLoadedData): void => {
  localStorage.setItem(CUSTOMER_CACHE, JSON.stringify(data));
};
export const getBlankVehicle = (): ILoadedVehicle => ({
  year: null,
  mileage: null,
  appointmentHashKeys: [],
  vin: '',
  model: '',
  make: '',
  warrantyExpiration: null,
});
export const getBlankCustomer = (sessionId?: string): ICustomerLoadedData => {
  return {
    id: '',
    vehicles: [],
    lastName: '',
    firstName: '',
    fullName: '',
    emails: [],
    sessionId,
    phoneNumbers: [],
  };
};
export const clearCustomerCache = (): void => {
  localStorage.removeItem(CUSTOMER_CACHE);
};
export const getCustomerCache = (): ICustomerLoadedData | null => {
  try {
    const item = localStorage.getItem(CUSTOMER_CACHE);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as ICustomerLoadedData;
  } catch {
    return null;
  }
};

export const loadAllServiceCategories =
  (serviceCenterId: number): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.ServiceCategories.GetShortByQuery, {
      data: { serviceCenterId, pageSize: 0, pageIndex: 0 },
    })
      .then(({ data }) => {
        if (data?.result) dispatch(getAllServiceCategories(data.result));
      })
      .catch(err => {
        console.log('load all service categories error', err);
      });
  };
export const getServiceValetSlots = createAction<IServiceValetAppointment[]>(
  'Appointment/GetServiceValetSlots'
);
export const getDropOffSettings = createAction<IDropOffSettings>('Appointment/GetDropOffSettings');
export const loadServiceValetSlots =
  (
    data: IAppointmentSlotsRequest,
    loadCB?: TCallback,
    onLoadedCb?: (isEmptyList: boolean) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: TArgCallback<any>
  ): AppThunk =>
  dispatch => {
    dispatch(setSlotsLoading(true));
    Api.call<ISVAppointmentResponse>(Api.endpoints.AppointmentSlots.GetServiceValetSlots, { data })
      .then(result => {
        const { items, dropOffSettings, searchedDateRange } = result.data;
        dispatch(getServiceValetSlots(items.map(el => ({ ...el, uniqueId: uuidv4() }))));
        if (searchedDateRange) dispatch(setLoadedDateRange(searchedDateRange));
        if (dropOffSettings) dispatch(getDropOffSettings(dropOffSettings));
        dispatch(setSlotsServiceTypeOptionId(data.serviceTypeOptionId ?? null));
        const searchDate = data.fromDate || data.startDate;
        dispatch(setSlotsSearchDate(searchDate as TParsableDate));
        if (loadCB) {
          loadCB();
        }
        if (onLoadedCb) {
          onLoadedCb(!items.length);
        }
      })
      .catch(err => {
        if (onError) {
          onError(err);
        }
        if (onLoadedCb) {
          onLoadedCb(true);
        }
        dispatch(getServiceValetSlots([]));
        console.log('get service valet slots err', err);
      })
      .finally(() => {
        if (loadCB) {
          loadCB();
        }
        dispatch(setSlotPodId(null));
        dispatch(setSlotsLoading(false));
      });
  };

export const clearAppointmentSlots = (): AppThunk => (dispatch, getState) => {
  const { appointment, serviceValetAppointment } = getState().appointment;
  if (appointment) {
    dispatch(selectAppointment(null));
  }
  if (serviceValetAppointment) {
    dispatch(selectServiceValetAppointment(null));
  }
};
