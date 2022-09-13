import {createAction} from "@reduxjs/toolkit";
import {
    IAppointmentByQuery,
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
    EServiceType,
    EUserType,
    IAppointmentId,
    IServiceOffer,
    IValueService,
    TLanguage,
    TMaintenanceDetails,
    TYear
} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {TScreen} from "../../../components/Layout/types";
import {selectAppointment, selectSR} from "../appointment/actions";
import {TView} from "../../../components/Welcome/types";

export const selectService = createAction<IServiceCategory|null>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory | null>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<IPackageOptions|null>("fAppointment/setPackage");
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
export const selectCategoriesIds = createAction<number[]>('fAppointment/SelectCategoriesIds');
export const getSlotsGap = createAction<number>('fAppointment/GetSlotsGap');
export const setUserType = createAction<EUserType>('fAppointment/SetUserType');
export const setServiceType = createAction<EServiceType>('fAppointment/SetServiceType');
export const setZipCode = createAction<string | null>('fAppointment/SetZipCode');
export const setAddress = createAction<any>('fAppointment/SetAddress');
export const setValueService = createAction<IValueService | null>('fAppointment/SetValueService');
export const getSeriesModels = createAction<TYear[]>('fAppointment/GetSeriesModels');
export const getValueServiceOffers = createAction<IServiceOffer[]>('fAppointment/GetValueServiceOffers');
export const setOffersLoading = createAction<boolean>('fAppointment/SetOffersLoading');
export const setSideBarSteps = createAction<TScreen[]>('fAppointment/SetSideBarSteps');
export const setMobileServiceAvailability = createAction<boolean>('fAppointment/SetMobileServiceState');
export const setPickUpDropOffAvailability = createAction<boolean>('fAppointment/SetPickUpDropOffAvailability');
export const setValueServiceAvailability = createAction<boolean>('fAppointment/SetValueServiceAvailability');
export const setWelcomeScreenView = createAction<TView>('fAppointment/SetWelcomeScreenView');
export const switchLanguage = createAction<TLanguage>('fAppointment/ChangeLanguage');

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

export const loadConsultants = (id: string): AppThunk => async dispatch => {
    Api.call<PaginatedAPIResponse<IServiceConsultant>>(
        Api.endpoints.ServiceConsultants.GetByQuery,
        {
            data: {
                serviceCenterId: decodeSCID(id)
            }
        })
        .then(({data: {result}}) => {
            dispatch(setConsultants(result));
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
    dispatch(selectService(null));
    dispatch(selectSubService(null));
    dispatch(selectAppointment(null));
    dispatch(setValueService(null));
    dispatch(selectCategoriesIds([]));
    dispatch(selectSR(null));
    dispatch(setTiming(null));
    dispatch(setAdvisor(null));
    dispatch(setTransportation(null));
}