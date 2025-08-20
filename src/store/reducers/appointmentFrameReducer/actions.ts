/* eslint-disable max-lines */
/* eslint-disable complexity */

import { createAction } from '@reduxjs/toolkit';
import {
  EMaintenanceOptionType,
  EServiceCategoryPage,
  EServiceCenterName,
  IAddressData,
  IAppointmentByKey,
  IConsultantsRequestData,
  ICreateAppointmentResp,
  ICustomer,
  ICustomerLoadedData,
  ILoadedVehicle,
  IMake,
  IPackage,
  IPackageOptions,
  IServiceCategory,
  IServiceConsultant,
  ITransportation,
} from '../../../api/types';
import {
  EAppointmentTimingType,
  EContactMethodTypes,
  IServiceRequestPrice,
  IVehicle,
} from '../appointment/types';
import {
  EPackagePricingType,
  EServiceType,
  EUserType,
  IAncillaryByZipRequest,
  IAppointmentId,
  ICreateAppointmentRequest,
  ICustomerConsentBooking,
  ILoadSlotsRequestData,
  ISearchConsentsData,
  IServiceOffer,
  IValueService,
  TAncillaryPriceByZip,
  TDriverForRequest,
  TEditingPosition,
  TFiltersVisibility,
  TLanguage,
  TMaintenanceDetails,
  TMaintenanceOption,
  TServiceCategory,
  TTrackerState,
  TVehicleForRequest,
  TYear,
} from './types';
import {
  AppThunk,
  IMaintenanceItem,
  IPagingResponse,
  IRecallByVin,
  PaginatedAPIResponse,
  TArgCallback,
  TCallback,
  TParsableDate,
  TView,
} from '../../../types/types';
import { TScreen } from '../../../types/screens';
import {
  decodeSCID,
  getCategories,
  getModelCode,
  getVehicleData,
  mapModelsWithParentNames,
  mapRecallsForRequest,
} from '../../../utils/utils';
import { getYearOptions } from '../../../utils/getDate';
import {
  getAppointmentSlots,
  getServiceValetSlots,
  saveCustomerCache,
  selectAppointment,
  selectServiceValetAppointment,
  selectSR,
  selectSRMultiple,
  setAppointmentWasChanged,
  setCustomerLoadedData,
  setSlotsSearchDate,
  setSlotsServiceTypeOptionId,
  setSlotsTransportationId,
  setWaitListSettings,
} from '../appointment/actions';
import { IHOODataForm } from '../serviceCenters/types';
import { IFirstScreenOption } from '../serviceTypes/types';
import { TPackagePrice } from '../packages/types';
import { updateSelectedRecalls } from '../recall/actions';
import { EServiceCategoryType } from '../categories/types';
import { setAdvisorAvailable } from '../bookingFlowConfig/actions';
import { EScheduler } from '../appointments/types';
import { setAppointmentsLoading, setCurrentAppointmentLoading } from '../appointments/actions';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import dayjs from 'dayjs';
import { setLoading } from '../slotScoring/actions';
import { setConsentOpen, setSlotsWarningShowed } from '../modals/actions';
import { API } from '../../../api/api';
import { Dispatch, SetStateAction } from 'react';
import { TTransportationData } from '../../../features/booking/AppointmentFlow/Screens/TransportationNeeds/types';
import { ETransportationType } from '../transportationNeeds/types';
import { collectServiceRequestsForConsents } from '../../../utils/collectServiceRequestsForConsents';
import { collectServiceRequestIds } from '../../../utils/collectServiceRequestIds';

export const selectService = createAction<IServiceCategory | null>('fAppointment/selectService');
export const selectSubService = createAction<IServiceCategory | null>(
  'fAppointment/selectSubService'
);

export const setPackage = createAction<IPackageOptions | null>('fAppointment/setPackage');
export const setPackagePricingType = createAction<EPackagePricingType | null>(
  'fAppointment/setPackagePricingType'
);
export const setAdvisor = createAction<IServiceConsultant | null>('fAppointment/setAdvisor');
export const setTiming = createAction<EAppointmentTimingType | null>('fAppointment/setTiming');
export const setInitialTiming = createAction<EAppointmentTimingType | null>(
  'fAppointment/setInitialTiming'
);
export const setTime = createAction<TParsableDate>('fAppointment/setTime');
export const setVehicle = createAction<ILoadedVehicle | null>('fAppointment/setVehicle');
export const updateVehicle = createAction<Partial<IVehicle>>('fAppointment/updateVehicle');
export const setCustomer = createAction<ICustomer>('fAppointment/setCustomer');
export const setReminders = createAction<EContactMethodTypes[]>('fAppointment/setReminders');
export const setAppointmentId = createAction<IAppointmentId>('fAppointment/setAppointmentId');
export const setTransportation = createAction<ITransportation | null>(
  'fAppointment/setTransportation'
);
export const setMaintenanceDetails = createAction<Partial<TMaintenanceDetails>>(
  'fAppointment/setMaintenanceDetails'
);
export const setUpdateAppointment = createAction<IAppointmentByKey>(
  'fAppointment/setUpdateAppointment'
);
export const setCommentsForCategories = createAction<TServiceCategory>(
  'fAppointment/setCommentsForCategories'
);
export const setLoadingPackages = createAction<boolean>('fAppointment/loadingPackages');
export const setPackages = createAction<IPackage[]>('fAppointment/setPackages');
export const setConsultants = createAction<IServiceConsultant[]>('fAppointment/setConsultants');
export const setConsultantsLoading = createAction<boolean>('fAppointment/setConsultantsLoading');
export const setCurrentFrameScreen = createAction<TScreen>('fAppointment/setCurrentScreen');
export const getMakes = createAction<IMake[]>('fAppointment/GetMakes');
export const getModels = createAction<string[]>('fAppointment/GetModels');
export const setTrackerCreated = createAction<TTrackerState>('fAppointment/SetTrackerCreated');
export const setAdditionalServicesChosen = createAction<boolean>(
  'fAppointment/SetAdditionalServicesChosen'
);
export const setPackageIsSelected = createAction<boolean>('fAppointment/SetPackageIsSelected');
export const setSelectedPackageOptionType = createAction<number | null>(
  'fAppointment/SetSelectedPackageOptionType'
);
export const setSelectedPackagePriceTitles = createAction<TPackagePrice[]>(
  'fAppointment/SetSelectedPackagePriceTitles'
);
export const selectCategories = createAction<TServiceCategory[]>('fAppointment/SelectCategories');
export const getSlotsGap = createAction<number>('fAppointment/GetSlotsGap');
export const setUserType = createAction<EUserType>('fAppointment/SetUserType');
export const setServiceTypeOption = createAction<IFirstScreenOption | null>(
  'fAppointment/SetServiceTypeOption'
);
export const setSelectedServiceTypeOptions = createAction<IFirstScreenOption[]>(
  'fAppointment/SetSelectedServiceTypeOptions'
);
export const setZipCode = createAction<string>('fAppointment/SetZipCode');
export const setAddress = createAction<string | null>('fAppointment/SetAddress');
export const setPoliticalState = createAction<string>('fAppointment/SetPoliticalState');
export const setCity = createAction<string>('fAppointment/SetCity');
export const setStreetName = createAction<string>('fAppointment/SetStreetName');
export const setValueService = createAction<IValueService | null>('fAppointment/SetValueService');
export const getSeriesModels = createAction<TYear[]>('fAppointment/GetSeriesModels');
export const getValueServiceOffers = createAction<IServiceOffer[]>(
  'fAppointment/GetValueServiceOffers'
);
export const setOffersLoading = createAction<boolean>('fAppointment/SetOffersLoading');
export const setSideBarSteps = createAction<TScreen[]>('fAppointment/SetSideBarSteps');
export const setSideBarMenu = createAction<string[]>('fAppointment/SetSideBarMenu');
export const setSideBarActualSteps = createAction<{ [K in TScreen]: number }>(
  'fAppointment/SetSideBarMenuActualSteps'
);
export const setSideBarStepsList = createAction<TScreen[]>('fAppointment/SetSideBarStepsList');
export const setMobileServiceAvailability = createAction<boolean>(
  'fAppointment/SetMobileServiceState'
);
export const setPickUpDropOffAvailability = createAction<boolean>(
  'fAppointment/SetPickUpDropOffAvailability'
);
export const setValueServiceAvailability = createAction<boolean>(
  'fAppointment/SetValueServiceAvailability'
);
export const setWelcomeScreenView = createAction<TView>('fAppointment/SetWelcomeScreenView');
export const switchLanguage = createAction<TLanguage>('fAppointment/ChangeLanguage');
export const setAncillaryPriceByZip = createAction<TAncillaryPriceByZip>(
  'fAppointment/SetAncillaryPriceByZip'
);
export const setAncillaryPriceLoading = createAction<boolean>(
  'fAppointment/SetAncillaryPriceLoading'
);
export const setFilteredZipCodes = createAction<string[]>('fAppointment/SetFilteredZipCodes');
export const setSelectedRecalls = createAction<IRecallByVin[]>('fAppointment/SetSelectedRecalls');
export const setRecallsAreShown = createAction<boolean>('fAppointment/SetRecallsAreShown');
export const setHoursOfOperations = createAction<IHOODataForm[]>(
  'fAppointment/SetHorsOfOperations'
);
export const setPackageEMenuType = createAction<EMaintenanceOptionType | null>(
  'fAppointment/SetPackageEMenuType'
);
export const setShowServiceCentersList = createAction<boolean>(
  'fAppointment/SetShowServiceCentersList'
);
export const setAppointmentSaving = createAction<boolean>('fAppointment/SetAppointmentSaving');
export const setHashKey = createAction<string>('fAppointment/SetHashKey');
export const setAppointmentByKey = createAction<IAppointmentByKey | null>(
  'fAppointment/SetAppointmentByKey'
);
export const setCarIsValidForUpdate = createAction<boolean>('fAppointment/SetCarIsValidForUpdate');
export const setUsualFlowNeeded = createAction<boolean>('fAppointment/SetUsualFlowNeeded');
export const setEditingPosition = createAction<TEditingPosition | null>(
  'fAppointment/SetEditingPosition'
);
export const getAppointmentRequestsPrices = createAction<IServiceRequestPrice[]>(
  'fAppointment/GetAppointmentRequestsPrices'
);
export const setAppointmentNotes = createAction<string>('fAppointment/SetAppointmentNotes');
export const setServiceOptionChanged = createAction<boolean>(
  'fAppointment/SetServiceOptionChanged'
);
export const getTransactionValue = createAction<number>('fAppointment/GetTransactionValue');
export const setPassedScreens = createAction<TScreen[]>('fAppointment/SetPassedScreens');
export const deleteLastScreen = createAction('fAppointment/DeleteLastScreen');
export const setConsentsLoading = createAction<boolean>('fAppointment/SetConsentsLoading');
export const setFiltersVisibility = createAction<Partial<TFiltersVisibility>>(
  'fAppointment/SetFiltersVisibility'
);
export const updateAppointmentDetails = createAction<ILoadSlotsRequestData>(
  'fAppointment/UpdateAppointmentDetails'
);

export const setValueServicePartial =
  (data: Partial<IValueService>): AppThunk =>
  (dispatch, getState) => {
    const service = getState().appointmentFrame.valueService;
    const emptyService = {
      year: null,
      model: null,
      series: undefined,
      selectedService: null,
    };
    if (service) {
      dispatch(setValueService({ ...service, ...data }));
    } else {
      dispatch(setValueService({ ...emptyService, ...data }));
    }
  };

export const loadConsultantsForCloning =
  (serviceCenterId: string, appointment: IAppointmentByKey, cb: TCallback): AppThunk =>
  dispatch => {
    dispatch(setConsultantsLoading(true));

    const {
      serviceRequests,
      maintenancePackageOption,
      serviceTypeOption,
      vehicle,
      address,
      hashKey,
      serviceCategories,
      recallsModel,
    } = appointment;

    const data: IConsultantsRequestData = {
      serviceCenterId: decodeSCID(serviceCenterId),
      pageIndex: 0,
      pageSize: 0,
      serviceRequests: serviceRequests
        ? serviceRequests.map(el => ({ id: el.id, comment: null }))
        : [],
      recalls: recallsModel ?? [],
      serviceCategories: serviceCategories.map(el => ({ id: el.id, comment: null })),
      maintenancePackageOption: maintenancePackageOption,
      serviceTypeOptionId: serviceTypeOption?.id ?? null,
      searchTerm: '',
      vehicle: {
        vin: vehicle.vin,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        mileage: vehicle.mileage,
        engineTypeId: vehicle.engineTypeId,
      },
      address: address?.fullAddress ?? '',
      zipCode: address?.zipCode ?? '',
    };
    if (hashKey) {
      data.appointmentHashKey = hashKey;
    }
    Api.call<PaginatedAPIResponse<IServiceConsultant>>(
      Api.endpoints.ServiceConsultants.GetByQuery,
      { data }
    )
      .then(({ data: { result } }) => {
        dispatch(setConsultants(result));
        cb();
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        dispatch(setConsultantsLoading(false));
        dispatch(setCurrentAppointmentLoading(false));
      });
  };

export const loadConsultantsForUpdating =
  (
    id: string,
    serviceTypeOptionId: number | null,
    appointment: IAppointmentByKey,
    onSuccess?: () => void
  ): AppThunk =>
  (dispatch, getState) => {
    dispatch(setConsultantsLoading(true));
    const { maintenancePackageOption, serviceRequests, serviceCategories, address } = appointment;
    const { selectedVehicle, selectedRecalls, valueService, sideBarSteps, appointmentByKey } =
      getState().appointmentFrame;
    const { isAdvisorAvailable, currentConfig } = getState().bookingFlowConfig;
    const recalls = mapRecallsForRequest(selectedRecalls);
    if (selectedVehicle) {
      if (
        serviceRequests?.length ||
        maintenancePackageOption ||
        serviceCategories?.length ||
        recalls?.length
      ) {
        const data: IConsultantsRequestData = {
          serviceCenterId: decodeSCID(id),
          pageIndex: 0,
          pageSize: 0,
          serviceRequests: serviceRequests.map(item => ({ id: item.id, comment: null })),
          recalls,
          serviceCategories,
          maintenancePackageOption,
          serviceTypeOptionId,
          searchTerm: '',
          vehicle: {
            vin: selectedVehicle.vin,
            year: selectedVehicle.year,
            make: selectedVehicle.make,
            model: selectedVehicle.model,
            mileage: selectedVehicle.mileage ?? appointmentByKey?.vehicle?.mileage ?? null,
            engineTypeId: selectedVehicle.engineTypeId,
          },
          address: address?.fullAddress ?? '',
          zipCode: address?.zipCode ?? '',
        };
        if (valueService?.selectedService) {
          data.valueServiceOfferIds = [valueService.selectedService.id];
        }
        if (appointmentByKey?.hashKey) {
          data.appointmentHashKey = appointmentByKey?.hashKey;
        }
        if (data.vehicle.mileage) {
          Api.call<PaginatedAPIResponse<IServiceConsultant>>(
            Api.endpoints.ServiceConsultants.GetByQuery,
            { data }
          )
            .then(({ data: { result } }) => {
              dispatch(setConsultants(result));
              if (onSuccess) {
                onSuccess();
              }
              if (!result.length) {
                dispatch(setAdvisorAvailable(false));
              } else {
                if (currentConfig?.advisorSelection && !isAdvisorAvailable) {
                  dispatch(
                    setSideBarSteps(
                      sideBarSteps.filter(
                        el => el !== 'appointmentTiming' && el !== 'appointmentSelection'
                      )
                    )
                  );
                  dispatch(setAdvisorAvailable(true));
                }
              }
              dispatch(setConsultantsLoading(false));
            })
            .catch(err => console.log(err));
        }
      }
    }
  };

export const loadConsultants =
  (
    id: string,
    serviceTypeOptionId: number | null,
    onEmptyList?: () => void,
    onSuccess?: (data: IServiceConsultant[]) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    const {
      selectedPackage,
      packagePricingType,
      packageEMenuType,
      selectedRecalls,
      selectedVehicle,
      address,
      zipCode,
      valueService,
      service,
      subService,
      serviceCategories,
      sideBarSteps,
      advisor,
      appointmentByKey,
    } = getState().appointmentFrame;
    const { selectedSR, selectedSRComments } = getState().appointment;
    const { allCategories } = getState().categories;
    const { isAdvisorAvailable, currentConfig } = getState().bookingFlowConfig;
    const serviceCategoryIds = allCategories
      .filter(category => {
        return (
          category.type === EServiceCategoryType.GeneralCategory &&
          serviceCategories.map(item => item.id).includes(category.id)
        );
      })
      .map(item => item.id);
    if (selectedVehicle) {
      const maintenancePackageOption = selectedPackage
        ? { id: selectedPackage?.id, priceType: packagePricingType }
        : packageEMenuType !== null
          ? { optionType: packageEMenuType }
          : null;
      const recalls = mapRecallsForRequest(selectedRecalls);
      const serviceRequestIds = collectServiceRequestIds(
        service,
        subService,
        null,
        selectedSR,
        undefined,
        selectedSRComments
      );
      if (
        serviceRequestIds.length ||
        maintenancePackageOption ||
        serviceCategoryIds.length ||
        recalls.length
      ) {
        dispatch(setConsultantsLoading(true));
        const data: IConsultantsRequestData = {
          serviceCenterId: decodeSCID(id),
          pageIndex: 0,
          pageSize: 0,
          serviceRequests: serviceRequestIds,
          recalls,
          serviceCategories: getCategories(allCategories, serviceCategories),
          maintenancePackageOption,
          serviceTypeOptionId,
          searchTerm: '',
          vehicle: {
            vin: selectedVehicle.vin,
            year: selectedVehicle.year,
            make: selectedVehicle.make,
            model: selectedVehicle.model,
            mileage: selectedVehicle.mileage,
            engineTypeId: selectedVehicle.engineTypeId,
          },
          address: typeof address === 'string' ? address : (address?.label ?? ''),
          zipCode,
        };
        if (valueService?.selectedService) {
          data.valueServiceOfferIds = [valueService.selectedService.id];
        }
        if (appointmentByKey?.hashKey) {
          data.appointmentHashKey = appointmentByKey?.hashKey;
        }
        Api.call<PaginatedAPIResponse<IServiceConsultant>>(
          Api.endpoints.ServiceConsultants.GetByQuery,
          { data }
        )
          .then(({ data: { result } }) => {
            dispatch(setConsultants(result));
            if (!result.length) {
              if (onEmptyList) {
                onEmptyList();
              }
              dispatch(setAdvisorAvailable(false));
              dispatch(setAdvisor(null));
            } else {
              if (onSuccess) {
                onSuccess(result);
              }
              if (currentConfig?.advisorSelection && !isAdvisorAvailable) {
                dispatch(
                  setSideBarSteps(
                    sideBarSteps.filter(
                      el => el !== 'appointmentTiming' && el !== 'appointmentSelection'
                    )
                  )
                );
                dispatch(setAdvisorAvailable(true));
              }
              if (advisor && !result.find(el => el.id === advisor.id)) {
                dispatch(setAdvisor(null));
              }
            }
            dispatch(setConsultantsLoading(false));
          })
          .catch(err => console.log(err));
      }
    }
  };

export const loadMakes =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    Api.call<{ result: IMake[]; paging: IPagingResponse }>(Api.endpoints.Vehicles.Makes, {
      data: {
        serviceCenterId,
        pageIndex: 0,
        pageSize: 0,
        isAscending: true,
        orderBy: 'OrderIndex',
      },
    })
      .then(({ data }) => {
        if (data) {
          dispatch(getMakes(mapModelsWithParentNames(data.result)));
        }
      })
      .catch(err => {
        console.log('get Makes error', err);
      });
  };

export const loadSeriesModels =
  (serviceCenterId: number): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.ValueService.GetSeriesModels, { params: { serviceCenterId } })
      .then(result => {
        if (result?.data) dispatch(getSeriesModels(result.data));
      })
      .catch(err => {
        console.log('get series models data for value service error', err);
      });
  };

export const loadServiceOffers =
  (year: number, seriesId: number, modelId: number, serviceCenterId: number): AppThunk =>
  dispatch => {
    dispatch(setOffersLoading(true));
    Api.call(Api.endpoints.ValueService.GetValueServiceOffers, {
      params: { year, seriesId, modelId, serviceCenterId },
    })
      .then(result => {
        if (result?.data) dispatch(getValueServiceOffers(result.data));
        dispatch(setOffersLoading(false));
      })
      .catch(err => {
        console.log('get value service offers error', err);
      });
  };

export const clearSelectedServices =
  (keepCategories?: boolean): AppThunk =>
  dispatch => {
    if (!keepCategories) dispatch(selectCategories([]));
    dispatch(setPackage(null));
    dispatch(setPackageIsSelected(false));
    dispatch(setSelectedPackageOptionType(null));
    dispatch(setPackagePricingType(null));
    dispatch(setPackageEMenuType(null));
    dispatch(selectService(null));
    dispatch(selectSubService(null));
    dispatch(setValueService(null));
    dispatch(selectSRMultiple({ ids: [], comments: {} }));
    dispatch(setAdvisor(null));
    dispatch(setTransportation(null));
    dispatch(setRecallsAreShown(false));
    dispatch(setSelectedRecalls([]));
    dispatch(setAdditionalServicesChosen(false));
  };

export const clearAppointmentData =
  (keepCategories?: boolean): AppThunk =>
  dispatch => {
    dispatch(clearSelectedServices(keepCategories));
    dispatch(selectAppointment(null));
    dispatch(setAcceptedConsentIds([]));
    dispatch(selectServiceValetAppointment(null));
    dispatch(setTiming(null));
    dispatch(setInitialTiming(null));
    dispatch(setHashKey(''));
    dispatch(setAppointmentByKey(null));
    dispatch(setUsualFlowNeeded(false));
    dispatch(setEditingPosition(null));
    dispatch(setAppointmentWasChanged(false));
    dispatch(setAppointmentNotes(''));
    dispatch(setConsultants([]));
    dispatch(setWaitListSettings(null));
    dispatch(setAcceptedConsentIds([]));
    dispatch(setSlotsWarningShowed(false));
    dispatch(getAppointmentSlots([]));
    dispatch(getServiceValetSlots([]));
    dispatch(setSlotsSearchDate(null));
    dispatch(setSlotsServiceTypeOptionId(null));
    dispatch(setSlotsTransportationId(null));
    dispatch(setPassedScreens([]));
  };

export const loadAncillaryPriceByZip =
  (
    data: IAncillaryByZipRequest,
    onSuccess: (data: TAncillaryPriceByZip) => void,
    onError: (err?: string) => void,
    onUnavailableOpen: () => void
  ): AppThunk =>
  dispatch => {
    dispatch(setAncillaryPriceLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.GetByZip, { data })
      .then(result => {
        if (result?.data) {
          dispatch(setAncillaryPriceByZip(result.data));
          onSuccess(result.data);
        }
        dispatch(setAncillaryPriceLoading(false));
      })
      .catch(err => {
        if (err.response?.data?.errorCode === 12) {
          onUnavailableOpen();
        } else {
          onError(err);
        }
        console.log('get ancillary price by zip code error', err);
      })
      .finally(() => {
        dispatch(setAncillaryPriceLoading(false));
      });
  };

export const loadFilteredZip =
  (
    data: { serviceCenterId: number; search: string; label?: string },
    onSuccess?: (list: string[], postalCode: string, label?: string) => void
  ): AppThunk =>
  dispatch => {
    dispatch(setAncillaryPriceLoading(true));
    Api.call(Api.endpoints.ZipCodes.GetFiltered, { data })
      .then(result => {
        if (result?.data?.zipCodes) dispatch(setFilteredZipCodes(result.data.zipCodes));
        if (onSuccess) onSuccess(result.data.zipCodes, data.search, data.label);
        dispatch(setAncillaryPriceLoading(false));
      })
      .catch(err => {
        console.log('get zip codes by filter error', err);
      });
  };

export const loadHoursOfOperations =
  (serviceCenterId: number): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {
      urlParams: { id: serviceCenterId },
    })
      .then(result => {
        if (result?.data) {
          dispatch(setHoursOfOperations(result.data));
        }
        dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('get hours of operations error', err);
      });
  };

export const setDefaultVisitCenterOption = (): AppThunk => (dispatch, getState) => {
  const { firstScreenOptions } = getState().serviceTypes;
  const visitCenterOptions = firstScreenOptions.filter(
    item => item.type === EServiceType.VisitCenter
  );
  const orderIndexes = visitCenterOptions.map(item => item.orderIndex);
  const minIndex = Math.min(...orderIndexes);
  const firstVisitCenterOption = visitCenterOptions.find(item => item.orderIndex === minIndex);
  const visitCenterWithoutTransport = visitCenterOptions.find(item => !item.transportationOption);
  const visitCenterWithTransport = visitCenterOptions.find(item => item.transportationOption);
  const defaultOption =
    visitCenterWithTransport && visitCenterWithoutTransport
      ? visitCenterWithoutTransport
      : firstVisitCenterOption;

  if (defaultOption) dispatch(setServiceTypeOption(defaultOption));
  dispatch(setCurrentFrameScreen('serviceNeeds'));
};

export const clearAppointmentSteps =
  (screenName: TScreen): AppThunk =>
  (dispatch, getState) => {
    const { sideBarSteps } = getState().appointmentFrame;
    const index = sideBarSteps.indexOf(screenName);
    if (index > -1) {
      const slicedSteps = sideBarSteps.slice(0, index + 1);
      dispatch(setSideBarSteps(slicedSteps));
    }
  };

export const handleAppointmentResponse =
  (
    data: ICreateAppointmentResp,
    endpoint: { route: string; method: string },
    onNext?: () => void
  ): AppThunk =>
  (dispatch, getState) => {
    const { customerLoadedData } = getState().appointment;
    const { customer } = getState().appointmentFrame;
    dispatch(
      setAppointmentId({
        id: data.id,
        hashKey: data.hashKey,
      })
    );
    if (data.maintenancePackageOption?.priceType) {
      dispatch(setPackagePricingType(data.maintenancePackageOption.priceType));
    }
    console.log('data', data);
    if (data.detailedPriceList) dispatch(getAppointmentRequestsPrices(data.detailedPriceList));
    dispatch(getTransactionValue(data.transactionValue ?? 0));

    if (customerLoadedData) {
      const updatedData: ICustomerLoadedData = { ...customerLoadedData };
      let vehicle = updatedData.vehicles.find(car => car.vin === data.vehicle?.vin);
      if (vehicle) {
        vehicle = { ...vehicle };
        vehicle.appointmentHashKeys = [...vehicle.appointmentHashKeys, data.hashKey];
      } else {
        if (data.vehicle) {
          updatedData.vehicles = [
            ...updatedData.vehicles,
            { ...data.vehicle, appointmentHashKeys: [data.hashKey] },
          ];
        }
      }
      if (!updatedData.emails?.length) {
        updatedData.emails = [customer.email];
      }
      if (updatedData.emails?.length) {
        if (updatedData.emails[0] !== customer.email) {
          updatedData.emails = [customer.email];
        }
      }
      updatedData.fullName = data.driver?.fullName;
      updatedData.id = data.customerId;
      updatedData.phoneNumbers = [data.driver?.phoneNumber];
      updatedData.companyName = data.driver.companyName;
      updatedData.isUpdating = false;

      dispatch(setCustomerLoadedData(updatedData));
      dispatch(setCustomer(data.driver));
      saveCustomerCache(updatedData);
    }
    if (onNext) {
      onNext();
    }
    dispatch(setAppointmentSaving(false));
  };

export const updateRecalls =
  (data: IAppointmentByKey, id: string): AppThunk =>
  (dispatch, getState) => {
    const { scProfile } = getState().appointment;
    const {
      vehicle,
      recalls,
      maintenancePackageOption,
      serviceRequests,
      serviceTypeOption,
      serviceCategories,
    } = data;
    if (vehicle?.vin && scProfile && recalls?.length) {
      const { vin, make, model, year } = vehicle;
      if (make && model && make && year) {
        dispatch(updateSelectedRecalls(scProfile.id, vin, make, model, year, recalls));
      }
      const serviceType =
        serviceTypeOption?.type === EServiceType.MobileService
          ? EServiceType.MobileService
          : EServiceType.VisitCenter;
      const recallCategorySelected =
        serviceCategories?.length === 1 &&
        serviceCategories[0]?.type === EServiceCategoryType.OpenRecalls;
      if (!maintenancePackageOption && !serviceRequests.length && recallCategorySelected) {
        Api.call<PaginatedAPIResponse<IServiceCategory>>(
          Api.endpoints.ServiceCategories.GetByQuery,
          {
            data: {
              serviceCenterId: decodeSCID(id),
              serviceType,
            },
          }
        ).then(result => {
          const category = result?.data?.result?.find(item => {
            return data.serviceCategories.map(el => el.id).includes(item.id);
          });
          if (category) {
            dispatch(selectCategories([category]));
            if (category.page === 0) {
              dispatch(selectService(category));
            } else {
              dispatch(selectSubService(category));
            }
          }
        });
      }
    }
  };

export const updatePackageOption =
  (maintenancePackageOption: IPackageOptions | null): AppThunk =>
  (dispatch, getState) => {
    const { scProfile } = getState().appointment;
    if (maintenancePackageOption && scProfile) {
      if (
        scProfile.serviceCenterFlag === EServiceCenterName.DealerBuilt &&
        scProfile.eMenuEnabled
      ) {
        dispatch(setPackageEMenuType(maintenancePackageOption.type));
      } else {
        dispatch(setPackage(maintenancePackageOption));
      }
    }
  };

export const setVehicleDataFromValueService = (): AppThunk => (dispatch, getState) => {
  const { valueService, makes } = getState().appointmentFrame;
  const { scProfile } = getState().appointment;
  const isBmWService =
    scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville ||
    scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest;
  const vehicle: ILoadedVehicle = {
    vin: '',
    make: '',
    model: '',
    year: null,
    mileage: null,
    appointmentHashKeys: [],
  };
  if (valueService && isBmWService) {
    const bmwMake = makes.find(item => item.name === 'BMW');
    if (bmwMake) {
      vehicle.make = bmwMake.name;
      const yearOptions = getYearOptions();
      if (
        valueService?.year?.year &&
        yearOptions.find(option => Number(option) === valueService?.year?.year)
      ) {
        vehicle.year = Number(valueService.year.year);
      }
      const model = bmwMake.models.find(model => model.name === valueService.series?.name);
      if (model) vehicle.model = model.name;
      dispatch(setVehicle(vehicle));
    }
  }
};

export const clearAppointmentsWhileCreating = (): AppThunk => (dispatch, getState) => {
  const { customerLoadedData } = getState().appointment;
  const { appointmentByKey } = getState().appointmentFrame;
  if (!customerLoadedData?.isUpdating && !appointmentByKey) {
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
  }
};

export const deleteIndService =
  (item: IMaintenanceItem): AppThunk =>
  (dispatch, getState) => {
    const { selectedSR } = getState().appointment;
    const { serviceCategories, service, subService } = getState().appointmentFrame;
    const { allCategories } = getState().categories;
    const services = selectedSR.filter(sr => sr !== item.id);
    if (item.id) {
      dispatch(selectSR(item.id));
    }
    dispatch(clearAppointmentsWhileCreating());
    const indServiceCategory = allCategories.find(category => {
      return (
        category.type === EServiceCategoryType.IndividualServices &&
        category.serviceRequests.find(el => el.id === item.id)
      );
    });
    const diagnoseCategory = allCategories.find(category => {
      return (
        category.type === EServiceCategoryType.Diagnose &&
        category.serviceRequests.find(el => el.id === item.id)
      );
    });
    let categories = [...serviceCategories];
    if (!indServiceCategory?.serviceRequests.find(request => services.includes(request.id))) {
      if (subService && indServiceCategory && subService?.id === indServiceCategory?.id)
        dispatch(selectSubService(null));
      if (service && indServiceCategory && service?.id === indServiceCategory?.id)
        dispatch(selectService(null));
      categories = categories.filter(item => item.id !== indServiceCategory?.id);
      dispatch(selectCategories(categories));
    }
    if (!diagnoseCategory?.serviceRequests.find(request => services.includes(request.id))) {
      if (subService && diagnoseCategory && subService?.id === diagnoseCategory?.id)
        dispatch(selectSubService(null));
      if (service && diagnoseCategory && service?.id === diagnoseCategory?.id)
        dispatch(selectService(null));
      categories = categories.filter(item => item.id !== diagnoseCategory?.id);
      dispatch(selectCategories(categories));
    }
  };

export const deletePackage = (): AppThunk => (dispatch, getState) => {
  const { service, packageEMenuType } = getState().appointmentFrame;
  if (service?.type === 1) dispatch(selectService(null));
  dispatch(clearAppointmentsWhileCreating());
  if (packageEMenuType !== null) dispatch(setPackageEMenuType(null));
  dispatch(setPackage(null));
};

export const deleteGeneralService =
  (item: IMaintenanceItem): AppThunk =>
  (dispatch, getState) => {
    const { service, subService, serviceCategories } = getState().appointmentFrame;
    if (service?.id === item.id) dispatch(selectService(null));
    if (subService?.id === item.id) dispatch(selectSubService(null));
    dispatch(clearAppointmentsWhileCreating());
    dispatch(selectCategories(serviceCategories.filter(scItem => scItem.id !== item.id)));
  };

export const deleteValueService = (): AppThunk => (dispatch, getState) => {
  const { service, subService, serviceCategories } = getState().appointmentFrame;
  if (service?.type === EServiceCategoryType.ValueService) {
    dispatch(selectService(null));
    dispatch(selectCategories(serviceCategories.filter(scItem => scItem.id !== service?.id)));
  }
  if (subService?.type === EServiceCategoryType.ValueService) {
    dispatch(selectSubService(null));
    dispatch(selectCategories(serviceCategories.filter(scItem => scItem.id !== subService?.id)));
  }
  dispatch(setVehicleDataFromValueService());
  dispatch(setValueService(null));
  dispatch(clearAppointmentsWhileCreating());
};

export const deleteRecall =
  (item: IMaintenanceItem): AppThunk =>
  (dispatch, getState) => {
    const {
      service,
      subService,
      serviceCategories,
      selectedRecalls,
      sideBarSteps,
      serviceTypeOption,
    } = getState().appointmentFrame;
    const { allCategories } = getState().categories;
    const recalls = selectedRecalls.filter(el => el.campaignNumber !== item.campaignNumber);
    const serviceType = serviceTypeOption
      ? serviceTypeOption.type
      : EServiceCategoryType.GeneralCategory;
    const selectedCategories = allCategories.filter(el =>
      serviceCategories.map(item => item.id).includes(el.id)
    );
    if (item.campaignNumber) {
      dispatch(setSelectedRecalls(recalls));
    }

    if (!recalls.length) {
      dispatch(setRecallsAreShown(false));
      const openRecallCategory = selectedCategories.find(
        el => el.type === EServiceCategoryType.OpenRecalls
      );
      if (openRecallCategory) {
        let filteredCategories = [];
        if (openRecallCategory) {
          filteredCategories = serviceCategories.filter(
            scItem => scItem.id !== openRecallCategory?.id
          );
          dispatch(selectCategories(filteredCategories));
        }
        if (service?.type === EServiceCategoryType.OpenRecalls) {
          dispatch(selectService(null));
        }
        if (subService?.type === EServiceCategoryType.OpenRecalls) {
          dispatch(selectSubService(null));
        }
        if (sideBarSteps?.length) {
          dispatch(
            setSideBarSteps(
              serviceType === EServiceType.VisitCenter
                ? ['serviceNeeds']
                : ['location', 'serviceNeeds']
            )
          );
        }
      }
    }
  };

export const handleSideBarAppointmentUpdate = (): AppThunk => (dispatch, getState) => {
  let steps: TScreen[] = [
    'carSelection',
    'location',
    'serviceNeeds',
    'describeMore',
    'opsCode',
    'packageSelection',
    'consultantSelection',
    'appointmentTiming',
    'appointmentSelection',
    'transportationNeeds',
    'appointmentConfirmation',
  ];
  const { isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable } =
    getState().bookingFlowConfig;
  if (!isAdvisorAvailable) steps = steps.filter(item => item !== 'consultantSelection');
  if (!isAppointmentTimingAvailable) steps = steps.filter(item => item !== 'appointmentTiming');
  if (!isTransportationAvailable) steps = steps.filter(item => item !== 'transportationNeeds');
  dispatch(setSideBarSteps(steps));
};

const findSelectedConsultant =
  (id: string): AppThunk =>
  (dispatch, getState) => {
    const { consultants } = getState().appointmentFrame;
    const selected = consultants.find(item => item.id === id);
    if (selected) {
      dispatch(setAdvisor(selected));
    }
  };

export const updateConsultant =
  (advisorId: string | null | undefined): AppThunk =>
  dispatch => {
    if (advisorId) {
      dispatch(findSelectedConsultant(advisorId));
    }
  };

export const createOrUpdateAppointment =
  (
    id: number,
    onNext: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => void,
    isMobile: boolean,
    isAdmin: boolean
  ): AppThunk =>
  async (dispatch, getState) => {
    const appointmentFrame = getState().appointmentFrame;
    const appointment = getState().appointment;
    const categories = getState().categories;
    const [make, model, year] = getVehicleData(
      appointmentFrame.selectedVehicle,
      appointmentFrame.valueService
    );
    dispatch(setAppointmentSaving(true));

    const serviceType: EServiceType =
      appointmentFrame?.serviceTypeOption?.type ?? EServiceType.VisitCenter;

    const vehicle: TVehicleForRequest = {
      dmsId: appointmentFrame?.selectedVehicle?.dmsId ?? null,
      engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId
        ? Number(appointmentFrame.selectedVehicle?.engineTypeId)
        : null,
      model,
      modelCode: getModelCode(appointmentFrame?.makes, appointmentFrame?.selectedVehicle),
      make,
      year,
      vin: appointmentFrame.selectedVehicle?.vin ?? '',
      mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
      modelDetails: appointmentFrame?.valueService?.model?.name ?? '',
    };

    const driver: TDriverForRequest = {
      ...appointmentFrame.customer,
      email: appointmentFrame.customer.email?.length ? appointmentFrame.customer.email : null,
    };

    const date =
      appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      appointment.serviceValetAppointment
        ? dayjs.utc(appointment.serviceValetAppointment.date).toISOString().split('T')[0] || ''
        : appointment.appointment
          ? appointment.appointment?.id.split('|')[0] || ''
          : appointmentFrame.appointmentByKey?.dateInUtc || '';

    const appointmentTimingType =
      appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff &&
      appointmentFrame.selectedTiming
        ? appointmentFrame.selectedTiming
        : EAppointmentTimingType.FirstAvailable;

    const transportationOptionId =
      serviceType === EServiceType.VisitCenter &&
      !appointmentFrame.serviceTypeOption?.transportationOption &&
      appointmentFrame.transportation
        ? appointmentFrame.transportation?.id
        : null;

    const serviceRequests = collectServiceRequestIds(
      appointmentFrame.service,
      appointmentFrame.subService,
      appointmentFrame.selectedPackage,
      appointment.selectedSR,
      undefined,
      appointment.selectedSRComments
    );

    const maintenancePackageOption: TMaintenanceOption | null = appointmentFrame.selectedPackage
      ? { id: appointmentFrame.selectedPackage.id, priceType: appointmentFrame.packagePricingType }
      : appointmentFrame.packageEMenuType !== null
        ? { optionType: appointmentFrame.packageEMenuType }
        : null;

    const slot =
      appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? '00:00:00'
        : appointment.appointment?.id
          ? appointment.appointment?.id.split('|')[1]
          : appointmentFrame.appointmentByKey?.timeSlot || '00:00:00';
    const settingsEnabled = Boolean(appointment.waitListSettings?.isEnabled);
    const isWaitListSlotSelected = appointment.appointment?.isOverbookingApplied && settingsEnabled;
    const isWaitListManaging =
      !appointment.appointment &&
      Boolean(appointmentFrame.appointmentByKey?.isWaitlist) &&
      appointmentFrame.appointmentByKey?.waitlistTextSettings?.isEnabled;
    const isVisitCenterAppointment =
      appointmentFrame?.serviceTypeOption?.type === EServiceType.VisitCenter ||
      !appointmentFrame.serviceTypeOption;

    const isWaitlist = isVisitCenterAppointment && (isWaitListSlotSelected || isWaitListManaging);

    const addressData: IAddressData = {
      address: appointmentFrame.streetName ?? '',
      city: appointmentFrame.city ?? '',
      state: appointmentFrame.politicalState ?? '',
      originalFullAddress: appointmentFrame.address?.label ?? appointmentFrame.address ?? null,
      zipCode: appointmentFrame.zipCode ?? null,
    };

    const data: ICreateAppointmentRequest = {
      id: appointmentFrame.id,
      appointmentTimingType,
      customerId: appointment.customerLoadedData?.id ?? appointmentFrame?.customer?.id ?? null,
      driver,
      vehicle,
      gmt: dayjs().utcOffset(),
      offerId: appointment.appointment?.offer?.id ?? null,
      contactMethodTypes: appointmentFrame.reminders,
      serviceCenterId: id,
      advisorId: appointmentFrame.advisor?.id ?? null,
      transportationOptionId,
      slot,
      serviceRequests,
      date,
      serviceCategories: getCategories(
        categories.allCategories,
        appointmentFrame.serviceCategories
      ),
      maintenancePackageOption,
      valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id
        ? [appointmentFrame?.valueService?.selectedService.id]
        : [],
      searchTerm: appointment.customerEnteredEmail,
      serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
      recalls: mapRecallsForRequest(appointmentFrame.selectedRecalls),
      schedulerType: isMobile ? EScheduler.SelfMobile : EScheduler.SelfWebsite,
      notes: appointmentFrame.appointmentNotes,
      address:
        appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff ||
        appointmentFrame.serviceTypeOption?.type === EServiceType.MobileService
          ? addressData
          : null,
      isWaitlist: Boolean(isWaitlist),
      customerConsentIds: appointmentFrame.acceptedConsentIds,
    };

    if (isAdmin) delete data.schedulerType;

    try {
      const endpoint = appointmentFrame.hashKey
        ? Api.endpoints.Appointments.UpdateByKey
        : Api.endpoints.Appointments.Create;

      const response = await Api.call<ICreateAppointmentResp>(endpoint, {
        data,
        urlParams: { id: appointmentFrame.hashKey },
      });
      dispatch(setEditingPosition(null));
      onNext();
      dispatch(handleAppointmentResponse(response.data, endpoint, onNext));
    } catch (e) {
      onError(e);
    } finally {
      dispatch(setAppointmentSaving(false));
    }
  };

export const checkCarIsValid =
  (onCarIsValid = () => {}, onCarIsInvalid = () => {}, skipEngineCheck?: boolean): AppThunk =>
  (dispatch, getState) => {
    const { selectedVehicle, makes } = getState().appointmentFrame;
    const { engineTypes, mileage } = getState().vehicleDetails;
    const { currentConfig } = getState().bookingFlowConfig;
    let carIsValid = true;
    if (selectedVehicle) {
      const models = makes.map(item => item.models).flat();
      if (!selectedVehicle.mileage) carIsValid = false;
      const existingMileage = mileage.find(
        item => item.value.toString() === selectedVehicle?.mileage?.toString()
      );
      if (mileage.length && !existingMileage) carIsValid = false;
      const existingEngineType = engineTypes.find(item => item.id === selectedVehicle.engineTypeId);
      if (
        !skipEngineCheck &&
        currentConfig?.engineType &&
        (!existingEngineType || !selectedVehicle.engineTypeId)
      )
        carIsValid = false;

      if (!selectedVehicle.vin?.length && selectedVehicle.make && selectedVehicle.model) {
        const existingMake = makes.find(
          item => item.name.toLowerCase() === selectedVehicle.make.toLowerCase()
        );
        const existingModel = models.find(
          item => item.name.toLowerCase() === selectedVehicle.model.toLowerCase()
        );
        if (!existingMake || !existingModel) carIsValid = false;
      }
    } else {
      carIsValid = false;
    }
    if (carIsValid) {
      onCarIsValid();
    } else {
      onCarIsInvalid();
    }
    dispatch(setCarIsValidForUpdate(carIsValid));
  };

export const loadAppointmentRequestsPrices =
  (serviceCenterId: number): AppThunk =>
  (dispatch, getState) => {
    const appointmentFrame = getState().appointmentFrame;
    const appointment = getState().appointment;
    const categories = getState().categories;
    const [make, model, year] = getVehicleData(
      appointmentFrame.selectedVehicle,
      appointmentFrame.valueService
    );

    dispatch(setAppointmentsLoading(true));

    const vehicle = {
      engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId
        ? Number(appointmentFrame.selectedVehicle?.engineTypeId)
        : null,
      model,
      make,
      year,
      vin: appointmentFrame.selectedVehicle?.vin ?? '',
      mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
    };
    const date =
      appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      appointment.serviceValetAppointment
        ? dayjs.utc(appointment.serviceValetAppointment.date).toISOString().split('T')[0] || ''
        : appointment.appointment
          ? appointment.appointment?.id.split('|')[0] || ''
          : appointmentFrame.appointmentByKey?.dateInUtc || '';

    const appointmentTimingType =
      appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff &&
      appointmentFrame.selectedTiming
        ? appointmentFrame.selectedTiming
        : EAppointmentTimingType.FirstAvailable;

    const serviceRequests = collectServiceRequestIds(
      appointmentFrame.service,
      appointmentFrame.subService,
      appointmentFrame.selectedPackage,
      appointment.selectedSR,
      undefined,
      appointment.selectedSRComments
    );

    const time =
      appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? '00:00:00'
        : appointment.appointment?.id
          ? appointment.appointment?.id.split('|')[1]
          : appointmentFrame.appointmentByKey?.timeSlot || '00:00:00';

    const maintenancePackageOption = appointmentFrame.selectedPackage
      ? { id: appointmentFrame.selectedPackage?.id, priceType: appointmentFrame.packagePricingType }
      : appointmentFrame.packageEMenuType !== null
        ? { optionType: appointmentFrame.packageEMenuType }
        : null;
    const data = {
      serviceRequests,
      serviceCategories: getCategories(
        categories.allCategories,
        appointmentFrame.serviceCategories
      ),
      valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id
        ? [appointmentFrame?.valueService?.selectedService.id]
        : [],
      recalls: mapRecallsForRequest(appointmentFrame.selectedRecalls),
      maintenancePackageOption,
      date,
      time,
      serviceCenterId,
      appointmentTimingType,
      advisorId: appointmentFrame.advisor?.id,
      zipCode: appointmentFrame.zipCode ?? null,
      serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
      vehicle,
      appointmentHashKey: appointmentFrame.appointmentByKey?.hashKey ?? '',
    };
    if (
      serviceRequests.length ||
      data.serviceCategories.length ||
      data.valueServiceOfferIds.length ||
      data.recalls.length ||
      maintenancePackageOption
    ) {
      Api.call(Api.endpoints.AppointmentPricing.GetPriceList, { data })
        .then(result => {
          console.log('result', result);
          if (result) dispatch(getAppointmentRequestsPrices(result.data));
          dispatch(setAppointmentsLoading(false));
        })
        .catch(err => {
          console.log('get appointment requests prices list err', err);
        });
    }
  };

export const getCustomerConsentsBooking = createAction<ICustomerConsentBooking[]>(
  'fAppointment/GetCustomerConsentBooking'
);
export const setAcceptedConsentIds = createAction<number[]>('fAppointment/SetAcceptedConsentIds');

export const searchForCustomerConsents =
  (onEmptyList: TCallback): AppThunk =>
  (dispatch, getState) => {
    dispatch(setConsentsLoading(true));

    const {
      scProfile,
      slotPodId,
      selectedSR,
      appointment,
      waitListSettings,
      serviceValetAppointment,
    } = getState().appointment;
    const {
      selectedVehicle,
      service,
      subService,
      selectedPackage,
      selectedRecalls,
      serviceTypeOption,
      transportation,
      userType,
      advisor,
      appointmentByKey,
      zipCode,
      serviceCategories,
      acceptedConsentIds,
    } = getState().appointmentFrame;
    const { allCategories } = getState().categories;
    if (scProfile && selectedVehicle) {
      const settingsEnabled = Boolean(waitListSettings?.isEnabled);
      const isWaitListSlotSelected = appointment?.isOverbookingApplied && settingsEnabled;
      const isWaitListManaging =
        !appointment &&
        Boolean(appointmentByKey?.isWaitlist) &&
        appointmentByKey?.waitlistTextSettings?.isEnabled;
      const isVisitCenterAppointment =
        serviceTypeOption?.type === EServiceType.VisitCenter || !serviceTypeOption;
      const isWaitlist = Boolean(
        isVisitCenterAppointment && (isWaitListSlotSelected || isWaitListManaging)
      );

      const date =
        appointment?.appointmentDate ??
        `${dayjs(serviceValetAppointment?.date).format('YYYY-MM-DD')}T00:00:00.000Z` ??
        '';
      const data: ISearchConsentsData = {
        serviceCenterId: scProfile.id,
        podId: slotPodId,
        make: selectedVehicle.make ?? null,
        model: selectedVehicle.model ?? null,
        serviceRequestIds: collectServiceRequestsForConsents(
          service,
          subService,
          serviceCategories,
          allCategories,
          selectedSR,
          selectedRecalls
        ),
        modelYear: selectedVehicle.year,
        customerType: userType ?? EUserType.New,
        serviceType: serviceTypeOption?.type ?? EServiceType.VisitCenter,
        transportationOptionId:
          serviceTypeOption?.transportationOption?.id ?? transportation?.id ?? null,
        advisorId: advisor?.id ?? null,
        appointmentTime: date,
        isWaitlistEnabled: isWaitlist,
        zipCode,
      };
      if (appointmentByKey?.id) data.appointmentRequestId = appointmentByKey.id;
      if (data.serviceType === EServiceType.VisitCenter) delete data.zipCode;
      if (selectedPackage) data.maintenancePackageOptionId = selectedPackage.id;
      Api.call<ICustomerConsentBooking[]>(Api.endpoints.CustomerConsent.Search, { data })
        .then(res => {
          if (res?.data?.length) {
            const filtered = res.data.filter(el => !acceptedConsentIds.includes(el.id));
            dispatch(getCustomerConsentsBooking(filtered));
            if (filtered.length) {
              dispatch(setConsentOpen(true));
            } else {
              onEmptyList();
            }
          } else {
            onEmptyList();
          }
          dispatch(setConsentsLoading(false));
        })
        .catch(err => {
          console.log('search for customer consent error', err);
        });
    }
  };

export const cloneAppointment =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (id: number, onNext: TArgCallback<string>, onError: TArgCallback<any>): AppThunk =>
    (dispatch, getState) => {
      const { currentAppointment } = getState().appointments;
      const appointment = getState().appointment;
      const { selectedRecalls, consultants, makes } = getState().appointmentFrame;
      if (currentAppointment) {
        dispatch(setAppointmentSaving(true));

        const vehicle: TVehicleForRequest = {
          dmsId: currentAppointment?.vehicle?.dmsId ?? null,
          engineTypeId: currentAppointment?.vehicle?.engineTypeId ?? null,
          model: currentAppointment?.vehicle?.model ?? null,
          modelCode: getModelCode(makes, currentAppointment?.vehicle),
          make: currentAppointment?.vehicle?.make ?? null,
          year: currentAppointment?.vehicle?.year
            ? currentAppointment?.vehicle?.year.toString()
            : null,
          vin: currentAppointment?.vehicle?.vin ?? '',
          mileage: currentAppointment?.vehicle?.mileage ?? null,
          modelDetails: '',
        };

        const driver: TDriverForRequest = {
          fullName: currentAppointment?.driver?.fullName ?? '',
          phoneNumber: currentAppointment?.driver?.phoneNumber ?? '',
          city: currentAppointment?.driver?.city ?? '',
          email: currentAppointment?.driver?.email ?? null,
        };

        const date =
          currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff &&
          appointment.serviceValetAppointment
            ? dayjs.utc(appointment.serviceValetAppointment.date).toISOString().split('T')[0] || ''
            : appointment.appointment?.id.split('|')[0] || '';

        const appointmentTimingType = EAppointmentTimingType.FirstAvailable;
        const transportationOptionId = currentAppointment?.transportationOption?.id ?? null;
        const serviceRequests = currentAppointment?.serviceRequests
          ? currentAppointment?.serviceRequests.map(el => ({ id: el.id, comment: null }))
          : [];
        const maintenancePackageOption = currentAppointment.maintenancePackageOption
          ? {
              id: currentAppointment.maintenancePackageOption.id,
              priceType: currentAppointment.maintenancePackageOption.priceType ?? null,
            }
          : null;

        const slot =
          currentAppointment.serviceTypeOption?.type === EServiceType.PickUpDropOff
            ? '00:00:00'
            : appointment.appointment?.id
              ? appointment.appointment?.id.split('|')[1]
              : '00:00:00';
        const settingsEnabled = Boolean(appointment.waitListSettings?.isEnabled);
        const isWaitListSlotSelected =
          appointment.appointment?.isOverbookingApplied && settingsEnabled;
        const isVisitCenterAppointment =
          currentAppointment?.serviceTypeOption?.type === EServiceType.VisitCenter ||
          !currentAppointment.serviceTypeOption;

        const isWaitlist = isVisitCenterAppointment && isWaitListSlotSelected;

        const advisor = consultants.find(el => el.id === currentAppointment?.advisorId)?.id;

        const data: ICreateAppointmentRequest = {
          id: currentAppointment.id,
          appointmentTimingType,
          customerId: currentAppointment.driver?.id ?? null,
          driver,
          vehicle,
          gmt: dayjs().utcOffset(),
          offerId: appointment.appointment?.offer?.id ?? null,
          contactMethodTypes: currentAppointment.contactMethodTypes,
          serviceCenterId: id,
          advisorId: advisor ? advisor : null,
          transportationOptionId,
          slot,
          serviceRequests,
          date,
          serviceCategories: currentAppointment.serviceCategories.map(el => ({
            id: el.id,
            comment: el.comment,
          })),
          maintenancePackageOption,
          searchTerm: '',
          serviceTypeOptionId: currentAppointment.serviceTypeOption?.id ?? null,
          recalls: mapRecallsForRequest(selectedRecalls),
          notes: currentAppointment.notes ?? '',
          valueServiceOfferIds: [],
          address: currentAppointment.address ?? null,
          isWaitlist: Boolean(isWaitlist),
          customerConsentIds: [],
          isAppointmentClone: true,
        };

        Api.call<ICreateAppointmentResp>(Api.endpoints.Appointments.Create, {
          data,
          urlParams: { id: currentAppointment.hashKey },
        })
          .then(({ data }) => {
            dispatch(setEditingPosition(null));
            onNext(data.hashKey);
            dispatch(setAppointmentSaving(false));
          })
          .catch(e => {
            onError(e);
          });
      }
    };

export const clearAddress = (): AppThunk => dispatch => {
  dispatch(setAddress(null));
  dispatch(setPoliticalState(''));
  dispatch(setCity(''));
  dispatch(setZipCode(''));
};

export const goToSlotsSelection =
  (prevOption?: IFirstScreenOption | undefined): AppThunk =>
  (dispatch, getState) => {
    const { isAdvisorAvailable, isAppointmentTimingAvailable, config, isTransportationAvailable } =
      getState().bookingFlowConfig;
    const { sideBarSteps, advisor } = getState().appointmentFrame;
    if (prevOption) {
      const prevConfig = config.find(el => el.serviceType === prevOption.type);
      const advisorsStepNeeded =
        prevConfig?.advisorSelection &&
        sideBarSteps[sideBarSteps.length - 1] === 'consultantSelection';
      dispatch(
        setCurrentFrameScreen(
          advisorsStepNeeded
            ? 'consultantSelection'
            : prevConfig?.transportationNeeds
              ? 'transportationNeeds'
              : prevConfig?.appointmentSelection
                ? 'appointmentTiming'
                : 'appointmentSelection'
        )
      );
    } else {
      dispatch(
        setCurrentFrameScreen(
          isAdvisorAvailable && !advisor
            ? 'consultantSelection'
            : isTransportationAvailable
              ? 'transportationNeeds'
              : isAppointmentTimingAvailable
                ? 'appointmentTiming'
                : 'appointmentSelection'
        )
      );
    }
  };

export const handleAppointmentUpdate =
  (
    car: ILoadedVehicle,
    setLoadingCar: Dispatch<SetStateAction<boolean>>,
    setServiceCategoryPage: Dispatch<SetStateAction<EServiceCategoryPage>>,
    isAuth: boolean,
    id: string,
    handleServiceTypeOption: TArgCallback<IAppointmentByKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showError: TArgCallback<any>
  ): AppThunk =>
  (dispatch, getState) => {
    const { firstScreenOptions } = getState().serviceTypes;
    const key = car.appointmentHashKeys[car.appointmentHashKeys.length - 1];

    setLoadingCar(true);
    setServiceCategoryPage(EServiceCategoryPage.Page1);
    if (key) {
      dispatch(setAppointmentSaving(true));
      API.appointment
        .getByKey(key)
        .then(({ data }) => {
          if (data) {
            if (isAuth) dispatch(setAppointmentNotes(data.notes ?? ''));
            const option = firstScreenOptions.find(item => item.id === data.serviceTypeOption?.id);
            if (data.waitlistTextSettings) {
              dispatch(
                setWaitListSettings({
                  text: data.waitlistTextSettings.text ?? '',
                  textHex: data.waitlistTextSettings.textHex ?? '',
                })
              );
            }
            dispatch(updateRecalls(data, id));
            dispatch(setUpdateAppointment(data));
            dispatch(setAppointmentByKey(data));
            dispatch(updatePackageOption(data.maintenancePackageOption));
            const comments = data.serviceRequests.reduce((acc: { [key: number]: string }, item) => {
              acc[item.id] = item.comment || '';
              return acc;
            }, {});
            dispatch(
              selectSRMultiple({ ids: data.serviceRequests.map(el => el.id), comments: comments })
            );
            handleServiceTypeOption(data);
            dispatch(handleSideBarAppointmentUpdate());
            dispatch(
              loadConsultantsForUpdating(id, option ? option.id : null, data, () => {
                dispatch(updateConsultant(data.advisorId));
              })
            );
            dispatch(checkCarIsValid());
            setLoadingCar(false);
            dispatch(setAppointmentSaving(false));
          }
        })
        .catch(e => {
          console.log(e);
          showError(e);
        });
    }
  };

export const getActiveTransportations = createAction<ITransportation[]>(
  'fAppointment/GetActiveTransportations'
);
export const setTransportationsLoading = createAction<boolean>(
  'fAppointment/SetTransportationsLoading'
);

export const loadActiveTransportations =
  (serviceCenterId: number): AppThunk =>
  (dispatch, getState) => {
    const {
      serviceCategories,
      selectedVehicle,
      selectedPackage,
      packagePricingType,
      packageEMenuType,
      selectedRecalls,
      hashKey,
      service,
      subService,
    } = getState().appointmentFrame;
    const { allCategories } = getState().categories;
    const { selectedSR, selectedSRComments } = getState().appointment;
    const { firstScreenOptions } = getState().serviceTypes;
    if (selectedVehicle) {
      dispatch(setTransportationsLoading(true));
      const maintenancePackageOption = selectedPackage
        ? { id: selectedPackage?.id, priceType: packagePricingType }
        : packageEMenuType !== null
          ? { optionType: packageEMenuType }
          : null;

      const data: TTransportationData = {
        serviceCenterId,
        serviceRequests: collectServiceRequestIds(
          service,
          subService,
          null,
          selectedSR,
          undefined,
          selectedSRComments
        ),
        serviceCategories: getCategories(allCategories, serviceCategories),
        recalls: mapRecallsForRequest(selectedRecalls),
        maintenancePackageOption,
        vehicle: {
          vin: selectedVehicle.vin,
          year: selectedVehicle.year,
          make: selectedVehicle.make,
          model: selectedVehicle.model,
          mileage: selectedVehicle.mileage,
          engineTypeId: selectedVehicle.engineTypeId,
        },
      };
      if (hashKey) data.appointmentHashKey = hashKey;
      Api.call<ITransportation[]>(Api.endpoints.TransportationOptions.GetActive, { data }).then(
        ({ data }) => {
          const serviceValetOption = firstScreenOptions.find(
            el => el.type === EServiceType.PickUpDropOff
          );
          dispatch(
            getActiveTransportations(
              serviceValetOption
                ? data
                : data.filter(el => el.type !== ETransportationType.PickUpDelivery)
            )
          );
          dispatch(setTransportationsLoading(false));
        }
      );
    } else {
      setTimeout(() => dispatch(setTransportationsLoading(false)), 500);
    }
  };
