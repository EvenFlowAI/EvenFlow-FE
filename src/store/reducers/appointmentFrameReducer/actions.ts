import {createAction} from "@reduxjs/toolkit";
import {
    EMaintenanceOptionType,
    IAppointmentByQuery, IConsultantsRequestData,
    ICustomer,
    ILoadedVehicle, IPackage,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType, IMake, IVehicle} from "../appointment/types";
import {
    EPackagePricingType,
    EServiceType,
    EUserType, IAncillaryByZipRequest,
    IAppointmentId,
    IServiceOffer,
    IValueService, TAncillaryPriceByZip,
    TLanguage,
    TMaintenanceDetails,
    TYear
} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {TScreen} from "../../../components/Layout/types";
import {getSlotsConsultantId, selectAppointment, selectServiceValetAppointment, selectSR} from "../appointment/actions";
import {TView} from "../../../components/Welcome/types";
import {IRecallByVin} from "../../../components/AppointmentFlow/AppointmentFrame/types";
import {IHOODataForm} from "../serviceCenters/types";
import {IFirstScreenOption} from "../serviceTypes/types";
import {TPackagePrice} from "../packages/types";

export const selectService = createAction<IServiceCategory|null>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory | null>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<IPackageOptions|null>("fAppointment/setPackage");
export const setPackagePricingType = createAction<EPackagePricingType|null>("fAppointment/setPackagePricingType");
export const setAdvisor = createAction<IServiceConsultant|null>("fAppointment/setAdvisor");
export const setTiming = createAction<EAppointmentTimingType|null>("fAppointment/setTiming");
export const setTime = createAction<moment.Moment|null>("fAppointment/setTime");
export const setVehicle = createAction<ILoadedVehicle|null>("fAppointment/setVehicle");
export const updateVehicle = createAction<Partial<IVehicle>>("fAppointment/updateVehicle");
export const setCustomer = createAction<ICustomer>("fAppointment/setCustomer");
export const setReminders = createAction<EReminderType[]>("fAppointment/setReminders");
export const setAppointmentId = createAction<IAppointmentId>("fAppointment/setAppointmentId");
export const setTransportation = createAction<ITransportation|null>("fAppointment/setTransportation");
export const setMaintenanceDetails = createAction<Partial<TMaintenanceDetails>>("fAppointment/setMaintenanceDetails");
export const setUpdateAppointment = createAction<IAppointmentByQuery>("fAppointment/setUpdateAppointment");
export const setLoadingPackages = createAction<boolean>("fAppointment/loadingPackages");
export const setPackages = createAction<IPackage[]>('fAppointment/setPackages');
export const setConsultants = createAction<IServiceConsultant[]>('fAppointment/setConsultants');
export const setCurrentFrameScreen = createAction<TScreen>('fAppointment/setCurrentScreen');
export const getMakes = createAction<IMake[]>('fAppointment/GetMakes');
export const getModels = createAction<string[]>('fAppointment/GetModels');
export const setTrackerCreated = createAction<boolean>('fAppointment/SetTrackerCreated');
export const setAdditionalServicesChosen = createAction<boolean>('fAppointment/SetAdditionalServicesChosen');
export const setPackageIsSelected = createAction<boolean>('fAppointment/SetPackageIsSelected');
export const setSelectedPackageOptionType = createAction<number | null>('fAppointment/SetSelectedPackageOptionType');
export const setSelectedPackagePriceTitles = createAction<TPackagePrice[]>('fAppointment/SetSelectedPackagePriceTitles');
export const selectCategoriesIds = createAction<number[]>('fAppointment/SelectCategoriesIds');
export const getSlotsGap = createAction<number>('fAppointment/GetSlotsGap');
export const setUserType = createAction<EUserType>('fAppointment/SetUserType');
export const setServiceTypeOption = createAction<IFirstScreenOption|null>('fAppointment/SetServiceTypeOption');
export const setZipCode = createAction<string>('fAppointment/SetZipCode');
export const setAddress = createAction<any>('fAppointment/SetAddress');
export const setValueService = createAction<IValueService | null>('fAppointment/SetValueService');
export const getSeriesModels = createAction<TYear[]>('fAppointment/GetSeriesModels');
export const getValueServiceOffers = createAction<IServiceOffer[]>('fAppointment/GetValueServiceOffers');
export const setOffersLoading = createAction<boolean>('fAppointment/SetOffersLoading');
export const setSideBarSteps = createAction<TScreen[]>('fAppointment/SetSideBarSteps');
export const setSideBarMenu = createAction<string[]>('fAppointment/SetSideBarMenu');
export const setSideBarActualSteps = createAction<{[K in TScreen]: number}>('fAppointment/SetSideBarMenuActualSteps');
export const setSideBarStepsList = createAction<TScreen[]>('fAppointment/SetSideBarStepsList');
export const setMobileServiceAvailability = createAction<boolean>('fAppointment/SetMobileServiceState');
export const setPickUpDropOffAvailability = createAction<boolean>('fAppointment/SetPickUpDropOffAvailability');
export const setValueServiceAvailability = createAction<boolean>('fAppointment/SetValueServiceAvailability');
export const setWelcomeScreenView = createAction<TView>('fAppointment/SetWelcomeScreenView');
export const switchLanguage = createAction<TLanguage>('fAppointment/ChangeLanguage');
export const setAncillaryPriceByZip = createAction<TAncillaryPriceByZip>('fAppointment/SetAncillaryPriceByZip');
export const setAncillaryPriceLoading = createAction<boolean>('fAppointment/SetAncillaryPriceLoading');
export const setFilteredZipCodes = createAction<string[]>('fAppointment/SetFilteredZipCodes');
export const setSelectedRecalls = createAction<IRecallByVin[]>('fAppointment/SetSelectedRecalls');
export const setRecallsAreShown = createAction<boolean>('fAppointment/SetRecallsAreShown');
export const setHoursOfOperations = createAction<IHOODataForm[]>('fAppointment/SetHorsOfOperations');
export const setPackageEMenuType = createAction<EMaintenanceOptionType|null>('fAppointment/SetPackageEMenuType');
export const setShowServiceCentersList = createAction<boolean>('fAppointment/SetShowServiceCentersList');
export const setAppointmentSaving = createAction<boolean>('fAppointment/SetAppointmentSaving');
export const setHashKey = createAction<string>('fAppointment/SetHashKey');

export const setValueServicePartial = (data: Partial<IValueService>): AppThunk => (dispatch, getState) => {
    const service = getState().appointmentFrame.valueService;
    const emptyService = {
        year: null,
        model: null,
        series: undefined,
        selectedService: null,
    }
    if (service) {
        dispatch(setValueService({...service, ...data}));
    } else {
        dispatch(setValueService({...emptyService, ...data}));
    }
}

export const loadConsultants = (data: IConsultantsRequestData, onEmptyList: () => void): AppThunk => async dispatch => {
    Api.call<PaginatedAPIResponse<IServiceConsultant>>(
        Api.endpoints.ServiceConsultants.GetByQuery, {data})
        .then(({data: {result}}) => {
            dispatch(setConsultants(result));
            if (!result.length) {
                onEmptyList()
            }
        })
        .catch(err => console.log(err))
}

export const loadPackages = (id: number): AppThunk => async (dispatch, getState) => {
    const selectedVehicle = getState().appointmentFrame.selectedVehicle;
    const maintenanceDetails = getState().appointmentFrame.maintenanceDetails;
    dispatch(setLoadingPackages(true));
    if (selectedVehicle && id && maintenanceDetails) {
        Api.call<IPackage[]>(
            Api.endpoints.MaintenancePackages.ByVehicle,
            {
                data: {
                    serviceCenterId: decodeSCID(`${id}`),
                    vehicle: {
                        ...selectedVehicle,
                        mileage: maintenanceDetails.serviceInterval
                    }
                }
            }
        ).then(({data}) => {
            setPackages(data);
        }).catch(err => {
            console.log(err)
        }).finally(() => dispatch(setLoadingPackages(false)))
    }
}

export const loadMakes = (serviceCenterId: number): AppThunk => async dispatch => {
    Api.call<IMake[]>(
        Api.endpoints.Vehicles.Makes,
        {params: {serviceCenterId}}
    ).then(({data}) => {
        if (data) {
            dispatch(getMakes(data));
        }
    })
        .catch(err => {
        console.log('get Makes error', err)
    })
}

export const loadSlotsGap = (serviceCenterId: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.SlotScoring.GetSlotsGap, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) dispatch(getSlotsGap(result.data))
        })
        .catch(err => {
            console.log('load slots gap err', err)
        })
}

export const loadSeriesModels = (serviceCenterId: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.ValueService.GetSeriesModels, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) dispatch(getSeriesModels(result.data))
        })
        .catch(err => {
            console.log('get series models data for value service error', err)
        })
}

export const loadServiceOffers = (year: number, seriesId: number, modelId: number, serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setOffersLoading(true))
    Api.call(Api.endpoints.ValueService.GetValueServiceOffers, {params: {year, seriesId, modelId, serviceCenterId}})
        .then(result => {
            if (result?.data) dispatch(getValueServiceOffers(result.data))
        })
        .catch(err => {
            console.log('get value service offers error', err)
        })
        .finally(() => dispatch(setOffersLoading(false)))
}

export const clearAppointmentData = (): AppThunk => (dispatch) => {
    dispatch(setPackage(null));
    dispatch(setPackageIsSelected(false));
    dispatch(setSelectedPackageOptionType(null));
    dispatch(selectService(null));
    dispatch(selectSubService(null));
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
    dispatch(setValueService(null));
    dispatch(selectCategoriesIds([]));
    dispatch(selectSR(null));
    dispatch(setTiming(null));
    dispatch(setAdvisor(null));
    dispatch(getSlotsConsultantId(null));
    dispatch(setTransportation(null));
    dispatch(setRecallsAreShown(false));
    dispatch(setSelectedRecalls([]))
    dispatch(setAdditionalServicesChosen(false));
    dispatch(setFrameDescription(''));
    dispatch(setPackagePricingType(null));
    dispatch(setPackageEMenuType(null));
    dispatch(setHashKey(''));
}

export const loadAncillaryPriceByZip = (data: IAncillaryByZipRequest, onSuccess: (data: TAncillaryPriceByZip) => void, onError: (err?: string) => void, onUnavailableOpen: () => void): AppThunk => dispatch => {
    dispatch(setAncillaryPriceLoading(true))
    Api.call(Api.endpoints.AncillaryPricing.GetByZip, {data})
        .then(result => {
            if (result?.data) {
                dispatch(setAncillaryPriceByZip(result.data))
                onSuccess(result.data)
            }
        })
        .catch(err => {
            if (err.response?.data?.errorCode === 12) {
                onUnavailableOpen()
            } else {
                onError(err)
            }
            console.log('get ancillary price by zip code error', err)
        })
        .finally(() => dispatch(setAncillaryPriceLoading(false)))
}

export const loadFilteredZip = (data: {serviceCenterId: number; search: string}): AppThunk => dispatch => {
    dispatch(setAncillaryPriceLoading(true))
    Api.call(Api.endpoints.ZipCodes.GetFiltered, {data})
        .then(result => {
            if (result?.data?.zipCodes) dispatch(setFilteredZipCodes(result.data.zipCodes))
        })
        .catch(err => {
            console.log('get zip codes by filter error', err)
        })
        .finally(() => dispatch(setAncillaryPriceLoading(false)))
}

export const loadHoursOfOperations = (serviceCenterId: number): AppThunk => dispatch => {
    Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id: serviceCenterId}})
        .then(result => {
            if (result?.data) {
               dispatch(setHoursOfOperations(result.data));
            }
        })
        .catch(err => {
            console.log('get hours of operations error', err)
        })
}

export const setDefaultVisitCenterOption = (): AppThunk => (dispatch, getState) => {
    const {firstScreenOptions} = getState().serviceTypes;
    const visitCenterOptions = firstScreenOptions.filter(item => item.type === EServiceType.VisitCenter);
    const orderIndexes = visitCenterOptions.map(item => item.orderIndex);
    const minIndex = Math.min(...orderIndexes);
    const firstVisitCenterOption = visitCenterOptions.find(item => item.orderIndex === minIndex);
    const visitCenterWithoutTransport = visitCenterOptions.find(item => !item.transportationOption);
    const visitCenterWithTransport = visitCenterOptions.find(item => item.transportationOption);
    const defaultOption = visitCenterWithTransport && visitCenterWithoutTransport ? visitCenterWithoutTransport : firstVisitCenterOption;

    if (defaultOption) dispatch(setServiceTypeOption(defaultOption));
    dispatch(setCurrentFrameScreen("serviceNeeds"));
}

export const clearAppointmentSteps = (screenName: TScreen): AppThunk => (dispatch, getState) => {
    const {sideBarSteps} = getState().appointmentFrame;
    const index = sideBarSteps.indexOf(screenName);
    if (index > -1) {
        const slicedSteps = sideBarSteps.slice(0, index + 1);
        dispatch(setSideBarSteps(slicedSteps))
    }
}