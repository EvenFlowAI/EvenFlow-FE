import {createAction} from "@reduxjs/toolkit";
import {
    EMaintenanceOptionType,
    EServiceCenterName,
    IAppointmentByKey,
    IConsultantsRequestData,
    ICreateAppointmentResp,
    ICustomer,
    ILoadedVehicle,
    IPackage,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation,
    TAppointmentAdvisor
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType, IMake, IServiceRequestPrice, IVehicle} from "../appointment/types";
import {
    EPackagePricingType,
    EServiceType,
    EUserType,
    IAncillaryByZipRequest,
    IAppointmentId,
    IServiceOffer,
    IValueService,
    TAncillaryPriceByZip,
    TEditingPosition,
    TLanguage,
    TMaintenanceDetails,
    TYear
} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {TScreen} from "../../../components/Layout/types";
import {
    getSlotsConsultantId,
    saveCustomerCache,
    selectAppointment,
    selectServiceValetAppointment,
    selectSR,
    setAppointmentWasChanged,
    setCustomerLoadedData,
    setWaitListSettings
} from "../appointment/actions";
import {TView} from "../../../components/Welcome/types";
import {IMaintenanceItem, IRecallByVin} from "../../../components/AppointmentFlow/AppointmentFrame/types";
import {IHOODataForm} from "../serviceCenters/types";
import {IFirstScreenOption} from "../serviceTypes/types";
import {TPackagePrice} from "../packages/types";
import {updateSelectedRecalls} from "../recall/actions";
import {EServiceCategoryType} from "../categories/types";
import {
    collectServiceRequestIds,
    getCategories,
    getVehicleData,
    mapRecallsForRequest
} from "../../../components/AppointmentFlow/AppointmentFrame/utils";
import {setAdvisorAvailable} from "../bookingFlowConfig/actions";
import {yearOptions} from "../../../components/AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import {EScheduler} from "../appointments/types";
import {setAppointmentsLoading} from "../appointments/actions";

export const selectService = createAction<IServiceCategory|null>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory | null>("fAppointment/selectSubService");
export const setFrameDescription = createAction<string>("fAppointment/setFrameDescription");
export const setPackage = createAction<IPackageOptions|null>("fAppointment/setPackage");
export const setPackagePricingType = createAction<EPackagePricingType|null>("fAppointment/setPackagePricingType");
export const setAdvisor = createAction<IServiceConsultant|null>("fAppointment/setAdvisor");
export const setAnyAdvisorSelected = createAction<boolean>("fAppointment/setAnyAdvisorSelected");
export const setTiming = createAction<EAppointmentTimingType|null>("fAppointment/setTiming");
export const setTime = createAction<moment.Moment|null>("fAppointment/setTime");
export const setVehicle = createAction<ILoadedVehicle|null>("fAppointment/setVehicle");
export const updateVehicle = createAction<Partial<IVehicle>>("fAppointment/updateVehicle");
export const setCustomer = createAction<ICustomer>("fAppointment/setCustomer");
export const setReminders = createAction<EReminderType[]>("fAppointment/setReminders");
export const setAppointmentId = createAction<IAppointmentId>("fAppointment/setAppointmentId");
export const setTransportation = createAction<ITransportation|null>("fAppointment/setTransportation");
export const setMaintenanceDetails = createAction<Partial<TMaintenanceDetails>>("fAppointment/setMaintenanceDetails");
export const setUpdateAppointment = createAction<IAppointmentByKey>("fAppointment/setUpdateAppointment");
export const setLoadingPackages = createAction<boolean>("fAppointment/loadingPackages");
export const setPackages = createAction<IPackage[]>('fAppointment/setPackages');
export const setConsultants = createAction<IServiceConsultant[]>('fAppointment/setConsultants');
export const setConsultantsLoading = createAction<boolean>('fAppointment/setConsultantsLoading');
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
export const setSelectedServiceTypeOptions = createAction<IFirstScreenOption[]>('fAppointment/SetSelectedServiceTypeOptions');
export const setZipCode = createAction<string>('fAppointment/SetZipCode');
export const setAddress = createAction<any>('fAppointment/SetAddress');
export const setPoliticalState = createAction<string>('fAppointment/SetPoliticalState');
export const setCity = createAction<string>('fAppointment/SetCity');
export const setStreetName = createAction<string>('fAppointment/SetStreetName');
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
export const setAppointmentByKey = createAction<IAppointmentByKey|null>("fAppointment/SetAppointmentByKey");
export const setCarIsValidForUpdate = createAction<boolean>("fAppointment/SetCarIsValidForUpdate");
export const setUsualFlowNeeded = createAction<boolean>("fAppointment/SetUsualFlowNeeded");
export const setEditingPosition = createAction<TEditingPosition|null>("fAppointment/SetEditingPosition");
export const getAppointmentRequestsPrices = createAction<IServiceRequestPrice[]>("fAppointment/GetAppointmentRequestsPrices");
export const setAppointmentNotes = createAction<string>("fAppointment/SetAppointmentNotes");
export const setServiceOptionChanged = createAction<boolean>("fAppointment/SetServiceOptionChanged");
export const getTransactionValue = createAction<number>('fAppointment/GetTransactionValue');
export const setPassedScreens = createAction<TScreen[]>('fAppointment/SetPassedScreens');
export const deleteLastScreen = createAction('fAppointment/DeleteLastScreen')

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

export const loadConsultantsForUpdating = (id: string, serviceTypeOptionId: number|null, appointment: IAppointmentByKey): AppThunk => (dispatch, getState) => {
    dispatch(setConsultantsLoading(true))
    const {
        maintenancePackageOption,
        serviceRequests,
        serviceCategories,
        address,
    } = appointment;
    const {selectedVehicle, selectedRecalls, valueService, sideBarSteps} = getState().appointmentFrame;
    const {isAdvisorAvailable, currentConfig} = getState().bookingFlowConfig;
    const recalls = mapRecallsForRequest(selectedRecalls);
    if (selectedVehicle) {
        if (serviceRequests?.length || maintenancePackageOption || serviceCategories?.length || recalls?.length) {
            const data: IConsultantsRequestData = {
                serviceCenterId: decodeSCID(id),
                pageIndex: 0,
                pageSize: 0,
                serviceRequestIds: serviceRequests.map(item => item.id),
                recalls,
                serviceCategoryIds: serviceCategories ? serviceCategories.map(item => item.id) : [],
                maintenancePackageOption,
                serviceTypeOptionId,
                searchTerm: "",
                vehicle: {
                    vin: selectedVehicle.vin,
                    year: selectedVehicle.year,
                    make: selectedVehicle.make,
                    model: selectedVehicle.model,
                    mileage: selectedVehicle.mileage,
                    engineTypeId: selectedVehicle.engineTypeId,
                },
                address: address?.fullAddress ?? '',
                zipCode: address?.zipCode ?? '',
            }
            if (valueService?.selectedService) {
                data.valueServiceOfferIds = [valueService.selectedService.id];
            }
            Api.call<PaginatedAPIResponse<IServiceConsultant>>(
                Api.endpoints.ServiceConsultants.GetByQuery, {data})
                .then(({data: {result}}) => {
                    dispatch(setConsultants(result));
                    if (!result.length) {
                        dispatch(setAdvisorAvailable(false));
                    } else {
                        if (currentConfig?.advisorSelection && !isAdvisorAvailable) {
                            dispatch(setSideBarSteps(sideBarSteps.filter(el => el !== 'appointmentTiming' && el !== "appointmentSelection")))
                            dispatch(setAdvisorAvailable(true));
                        }
                    }
                })
                .catch(err => console.log(err))
                .finally(() => dispatch(setConsultantsLoading(false)))
        }
    }
}

export const loadConsultants = (id: string, serviceTypeOptionId: number|null, onEmptyList?: () => void, onSuccess?: (data: IServiceConsultant[]) => void): AppThunk => async (dispatch, getState) => {
    dispatch(setConsultantsLoading(true))
    const {selectedPackage, packagePricingType, packageEMenuType, selectedRecalls, selectedVehicle, address, zipCode, valueService,
        service, subService, categoriesIds, sideBarSteps} = getState().appointmentFrame;
    const {selectedSR} = getState().appointment;
    const {allCategories} = getState().categories;
    const {isAdvisorAvailable, currentConfig} = getState().bookingFlowConfig;
    const serviceCategoryIds = allCategories
        .filter(category => {
            return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
        })
        .map(item => item.id);
    if (selectedVehicle) {
        const maintenancePackageOption = selectedPackage
            ? {id: selectedPackage?.id, priceType: packagePricingType}
            : packageEMenuType !== null
                ? {optionType: packageEMenuType}
                : null;
        const recalls = mapRecallsForRequest(selectedRecalls);
        const serviceRequestIds = collectServiceRequestIds(service, subService, null, selectedSR)
        if (serviceRequestIds.length || maintenancePackageOption || serviceCategoryIds.length || recalls.length) {
            const data: IConsultantsRequestData = {
                serviceCenterId: decodeSCID(id),
                pageIndex: 0,
                pageSize: 0,
                serviceRequestIds,
                recalls,
                serviceCategoryIds,
                maintenancePackageOption,
                serviceTypeOptionId,
                searchTerm: "",
                vehicle: {
                    vin: selectedVehicle.vin,
                    year: selectedVehicle.year,
                    make: selectedVehicle.make,
                    model: selectedVehicle.model,
                    mileage: selectedVehicle.mileage,
                    engineTypeId: selectedVehicle.engineTypeId,
                },
                address: typeof address === 'string' ? address : address?.label ?? '',
                zipCode,
            }
            if (valueService?.selectedService) {
                data.valueServiceOfferIds = [valueService.selectedService.id];
            }
            Api.call<PaginatedAPIResponse<IServiceConsultant>>(
                Api.endpoints.ServiceConsultants.GetByQuery, {data})
                .then(({data: {result}}) => {
                    dispatch(setConsultants(result));
                    if (!result.length) {
                        onEmptyList && onEmptyList()
                        dispatch(setAdvisorAvailable(false));
                        dispatch(setAdvisor(null))
                    } else {
                        onSuccess && onSuccess(result);
                        if (currentConfig?.advisorSelection && !isAdvisorAvailable) {
                            dispatch(setSideBarSteps(sideBarSteps.filter(el => el !== 'appointmentTiming' && el !== "appointmentSelection")))
                            dispatch(setAdvisorAvailable(true));
                        }
                    }
                })
                .catch(err => console.log(err))
                .finally(() => dispatch(setConsultantsLoading(false)))
        }
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

export const clearSelectedServices = (keepCategories?: boolean): AppThunk => (dispatch) => {
    !keepCategories && dispatch(selectCategoriesIds([]));
    dispatch(setPackage(null));
    dispatch(setPackageIsSelected(false));
    dispatch(setSelectedPackageOptionType(null));
    dispatch(setPackagePricingType(null));
    dispatch(setPackageEMenuType(null));
    dispatch(selectService(null));
    dispatch(selectSubService(null));
    dispatch(setValueService(null));
    dispatch(selectSR(null));
    dispatch(setAdvisor(null));
    dispatch(getSlotsConsultantId(null));
    dispatch(setTransportation(null));
    dispatch(setRecallsAreShown(false));
    dispatch(setSelectedRecalls([]))
    dispatch(setAdditionalServicesChosen(false));
}

export const clearAppointmentData = (keepCategories?: boolean): AppThunk => (dispatch) => {
    dispatch(clearSelectedServices(keepCategories));
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
    dispatch(setTiming(null));
    dispatch(setFrameDescription(''));
    dispatch(setHashKey(''));
    dispatch(setAppointmentByKey(null));
    dispatch(setUsualFlowNeeded(false));
    dispatch(setEditingPosition(null));
    dispatch(setAppointmentWasChanged(false))
    dispatch(setAppointmentNotes(''))
    dispatch(setConsultants([]));
    dispatch(setWaitListSettings(null));
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

export const loadFilteredZip = (data: {serviceCenterId: number; search: string}, onSuccess?: (list:string[], postalCode: string) => void): AppThunk => dispatch => {
    dispatch(setAncillaryPriceLoading(true))
    Api.call(Api.endpoints.ZipCodes.GetFiltered, {data})
        .then(result => {
            if (result?.data?.zipCodes) dispatch(setFilteredZipCodes(result.data.zipCodes))
            if (onSuccess) onSuccess(result.data.zipCodes, data.search)
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

export const handleAppointmentResponse = (data: ICreateAppointmentResp, endpoint: {route: string; method: string}, onNext?: () => void): AppThunk => (dispatch, getState) => {
    const {customerLoadedData} = getState().appointment;
    const {customer} = getState().appointmentFrame;
    dispatch(setAppointmentId({
        id: data.id,
        hashKey: data.hashKey,
    }));
    if (data.maintenancePackageOption?.priceType) {
        dispatch(setPackagePricingType(data.maintenancePackageOption.priceType))
    }
    if (data.detailedPriceList) dispatch(getAppointmentRequestsPrices(data.detailedPriceList))
    dispatch(getTransactionValue(data.transactionValue ?? 0))
    if (customerLoadedData && endpoint === Api.endpoints.Appointments.Create) {
        const updatedData = {...customerLoadedData};
        let vehicle = updatedData.vehicles.find(
            car => car.vin === data.vehicle?.vin
        );
        if (vehicle) {
            vehicle = {...vehicle};
            vehicle.appointmentHashKeys = [...vehicle.appointmentHashKeys, data.hashKey]
        } else {
            if (data.vehicle) {
                updatedData.vehicles = [...updatedData.vehicles, {...data.vehicle, appointmentHashKeys: [data.hashKey]}];
            }
        }
        if (!updatedData.emails?.length) {
            updatedData.emails = [customer.email];
            updatedData.fullName = data.driver?.fullName;
            updatedData.id = data.customerId;
            updatedData.phoneNumbers = [data.driver?.phoneNumber];
        }
        dispatch(setCustomerLoadedData(updatedData));
        dispatch(setCustomer(data.driver));
        saveCustomerCache(updatedData);
    }
    onNext && onNext()
}

export const updateRecalls = (data: IAppointmentByKey, id: string): AppThunk => (dispatch, getState) => {
    const {scProfile} = getState().appointment;
    const {
        vehicle,
        recalls,
        maintenancePackageOption,
        serviceRequests,
        serviceTypeOption,
        serviceCategories
    } = data;
    if (vehicle?.vin && scProfile && recalls?.length) {
        if (vehicle?.makeId) dispatch(updateSelectedRecalls(scProfile.id, vehicle.vin, vehicle.makeId, recalls))
        const serviceType = serviceTypeOption?.type === EServiceType.MobileService
            ? EServiceType.MobileService
            : EServiceType.VisitCenter;
        const recallCategorySelected = serviceCategories?.length === 1 && serviceCategories[0]?.type === EServiceCategoryType.OpenRecalls
        if (!maintenancePackageOption && !serviceRequests.length && recallCategorySelected) {
            Api.call<PaginatedAPIResponse<IServiceCategory>>(
                Api.endpoints.ServiceCategories.GetByQuery,
                {data: {
                        serviceCenterId: decodeSCID(id),
                        serviceType,
                    }}
            ).then(result => {
                const category = result?.data?.result?.find(item => item.type === EServiceCategoryType.OpenRecalls)
                if (category) {
                    dispatch(selectCategoriesIds([category.id]))
                    if (category.page === 0) {
                        dispatch(selectService(category))
                    } else {
                        dispatch(selectSubService(category))
                    }
                }
            })
        }
    }
}

export const updatePackageOption = (maintenancePackageOption: IPackageOptions|null): AppThunk => (dispatch, getState) => {
    const {scProfile} = getState().appointment;
    if (maintenancePackageOption && scProfile) {
        if (scProfile.serviceCenterFlag === EServiceCenterName.DealerBuilt && scProfile.eMenuEnabled) {
            dispatch(setPackageEMenuType(maintenancePackageOption.type))
        } else {
            dispatch(setPackage(maintenancePackageOption))
        }
    }
}

export const setVehicleDataFromValueService = (): AppThunk => (dispatch, getState) => {
    const {valueService, makes} = getState().appointmentFrame;
    const {scProfile} = getState().appointment;
    const isBmWService =  scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest;
    const vehicle: ILoadedVehicle = {
        vin: '',
        make: "",
        model: "",
        year: null,
        mileage: null,
        appointmentHashKeys: [],
    };
    if (valueService && isBmWService) {
        const bmwMake = makes.find(item => item.name === "BMW");
        if (bmwMake) {
            vehicle.make = bmwMake.name;
            if (valueService?.year?.year && yearOptions.find(option => Number(option) === valueService?.year?.year)) {
                vehicle.year = Number(valueService.year.year)
            }
            const model = bmwMake.models.find(model => model === valueService.series?.name);
            if (model) vehicle.model = model;
            dispatch(setVehicle(vehicle));
        }
    }
}

export const clearAppointmentsWhileCreating = (): AppThunk => (dispatch, getState) => {
    const {customerLoadedData} = getState().appointment;
    const {appointmentByKey} = getState().appointmentFrame;
    if (!customerLoadedData?.isUpdating && !appointmentByKey) {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
    }
}

export const deleteIndService = (item: IMaintenanceItem): AppThunk => (dispatch, getState) => {
    const {selectedSR} = getState().appointment;
    const {categoriesIds, service, subService} = getState().appointmentFrame;
    const {allCategories} = getState().categories;
    const services = selectedSR.filter(sr => sr !== item.id);
    item.id && dispatch(selectSR(item.id));
    dispatch(clearAppointmentsWhileCreating())
    const indServiceCategory = allCategories.find(category => {
        return category.type === EServiceCategoryType.IndividualServices && category.serviceRequests.find(el => el.id === item.id)
    });
    const diagnoseCategory = allCategories.find(category => {
        return category.type === EServiceCategoryType.Diagnose && category.serviceRequests.find(el => el.id === item.id)
    });
    let categories = [...categoriesIds];
    if (!indServiceCategory?.serviceRequests.find(request => services.includes(request.id))) {
        if (subService && indServiceCategory && subService?.id === indServiceCategory?.id) dispatch(selectSubService(null))
        if (service && indServiceCategory && service?.id === indServiceCategory?.id) dispatch(selectService(null))
        categories = categoriesIds.filter(id => id !== indServiceCategory?.id);
        dispatch(selectCategoriesIds(categories));
    }
    if (!diagnoseCategory?.serviceRequests.find(request => services.includes(request.id))) {
        if (subService && diagnoseCategory && subService?.id === diagnoseCategory?.id) dispatch(selectSubService(null))
        if (service && diagnoseCategory && service?.id === diagnoseCategory?.id) dispatch(selectService(null))
        categories = categories.filter(id => id !== diagnoseCategory?.id)
        dispatch(selectCategoriesIds(categories));
    }
}

export const deletePackage = (): AppThunk => (dispatch, getState) =>  {
    const {service, packageEMenuType} = getState().appointmentFrame
    if (service?.type === 1) dispatch(selectService(null));
    dispatch(clearAppointmentsWhileCreating())
    if (packageEMenuType !== null) dispatch(setPackageEMenuType(null));
    dispatch(setPackage(null));
}

export const deleteGeneralService = (item: IMaintenanceItem): AppThunk => (dispatch, getState) =>  {
    const {service, subService, categoriesIds} = getState().appointmentFrame
    if (service?.id === item.id) dispatch(selectService(null));
    if (subService?.id === item.id) dispatch(selectSubService(null));
    dispatch(clearAppointmentsWhileCreating())
    dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== item.id)));
}

export const deleteValueService = (): AppThunk => (dispatch, getState) => {
    const {service, subService, categoriesIds} = getState().appointmentFrame
    if (service?.type === EServiceCategoryType.ValueService) {
        dispatch(selectService(null));
        dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== service?.id)));
    }
    if (subService?.type === EServiceCategoryType.ValueService) {
        dispatch(selectSubService(null));
        dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== subService?.id)));
    }
    dispatch(setVehicleDataFromValueService())
    dispatch(setValueService(null));
    dispatch(clearAppointmentsWhileCreating())
}

export const deleteRecall = (item: IMaintenanceItem): AppThunk => (dispatch, getState) => {
    const {
        service,
        subService,
        categoriesIds,
        selectedRecalls,
        sideBarSteps,
        serviceTypeOption
    } = getState().appointmentFrame
    const recalls = selectedRecalls.filter(el => el.nhtsaRecallNumber !== item.nhtsaRecallNumber)
    const serviceType = serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter
    item.nhtsaRecallNumber && dispatch(setSelectedRecalls(recalls))

    if (!recalls.length) {
        dispatch(setRecallsAreShown(false));
        if (service?.type === EServiceCategoryType.OpenRecalls || subService?.type === EServiceCategoryType.OpenRecalls) {
            let filteredCategories = [];
            if (service?.type === EServiceCategoryType.OpenRecalls) {
                dispatch(selectService(null));
                filteredCategories = categoriesIds.filter(id => id !== service?.id);
                dispatch(selectCategoriesIds(filteredCategories));
            }
            if (subService?.type === EServiceCategoryType.OpenRecalls) {
                dispatch(selectSubService(null));
                filteredCategories = categoriesIds.filter(id => id !== subService?.id)
                dispatch(selectCategoriesIds(filteredCategories));
            }
            if (sideBarSteps?.length) {
                dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location", "serviceNeeds"]));
            }
        }
    }
}

export const handleSideBarAppointmentUpdate = (): AppThunk => (dispatch, getState) => {
    let steps: TScreen[] = ["carSelection", "location", "serviceNeeds", "describeMore", "opsCode", "packageSelection", "consultantSelection", "appointmentTiming", "appointmentSelection", "transportationNeeds", "appointmentConfirmation"];
    const {isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable} = getState().bookingFlowConfig;
    if (!isAdvisorAvailable) steps = steps.filter(item => item !== "consultantSelection");
    if (!isAppointmentTimingAvailable) steps = steps.filter(item => item !== "appointmentTiming");
    if (!isTransportationAvailable) steps = steps.filter(item => item !== "transportationNeeds");
    dispatch(setSideBarSteps(steps));
}

const findSelectedConsultant = (id: string): AppThunk => (dispatch, getState) => {
    const {consultants} = getState().appointmentFrame;
    const selected = consultants.find(item => item.id === id)
    selected && dispatch(setAdvisor(selected))
}

export const updateConsultant = (advisor: TAppointmentAdvisor|null|undefined): AppThunk => dispatch => {
    dispatch(setAnyAdvisorSelected(advisor?.isAnySelected ?? true))
    if (advisor?.id) {
        if (advisor?.isAnySelected) {
            dispatch(getSlotsConsultantId(advisor.id))
        } else {
            dispatch(findSelectedConsultant(advisor.id))
        }
    }
}

export const createOrUpdateAppointment = (id: number, onNext: () => void, onError: (e: any) => void, isMobile: boolean, isAdmin: boolean): AppThunk => (dispatch, getState) => {
    const appointmentFrame = getState().appointmentFrame;
    const appointment = getState().appointment;
    const categories = getState().categories;
    const [make, model, year] = getVehicleData(appointmentFrame.selectedVehicle, appointmentFrame.valueService);

    const vehicle = {
        dmsId: appointmentFrame?.selectedVehicle?.dmsId ?? null,
        engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId ? Number(appointmentFrame.selectedVehicle?.engineTypeId) : null,
        model,
        make,
        year,
        vin: appointmentFrame.selectedVehicle?.vin ?? '',
        mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
        modelDetails: appointmentFrame?.valueService?.model?.name ?? '',
    }
    const driver = {
        ...appointmentFrame.customer,
        email: appointmentFrame.customer.email?.length ? appointmentFrame.customer.email : null,
    }

    const date = appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff && appointment.serviceValetAppointment
        ? moment(appointment.serviceValetAppointment.date).toISOString().split("T")[0] || ""
        : appointment.appointment
            ? appointment.appointment?.id.split("|")[0] || ""
            : appointmentFrame.appointmentByKey?.dateInUtc || ""

    const appointmentTimingType = appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff && appointmentFrame.selectedTiming
        ? appointmentFrame.selectedTiming
        : EAppointmentTimingType.FirstAvailable;

    const transportationOptionId = appointmentFrame.serviceTypeOption?.transportationOption?.id
        ?? appointmentFrame.transportation?.id
        ?? null;

    const serviceRequestIds = collectServiceRequestIds(
        appointmentFrame.service,
        appointmentFrame.subService,
        appointmentFrame.selectedPackage,
        appointment.selectedSR,
    )

    const maintenancePackageOption = appointmentFrame.selectedPackage
        ? {id: appointmentFrame.selectedPackage?.id, priceType: appointmentFrame.packagePricingType}
        : appointmentFrame.packageEMenuType !== null
            ? {optionType: appointmentFrame.packageEMenuType}
            : null;

    const slot = appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? "00:00:00"
        : appointment.appointment?.id
            ? appointment.appointment?.id.split("|")[1]
            : appointmentFrame.appointmentByKey?.timeSlot || "00:00:00"
    const settingsEnabled = Boolean(appointment.waitListSettings?.isEnabled)
    const isWaitListSlotSelected = appointment.appointment?.isOverbookingApplied && settingsEnabled;
    const isWaitListManaging = !appointment.appointment
        && Boolean(appointmentFrame.appointmentByKey?.isWaitlist)
        && appointmentFrame.appointmentByKey?.waitlistTextSettings?.isEnabled;
    const isVisitCenterAppointment = appointmentFrame?.serviceTypeOption?.type === EServiceType.VisitCenter;

    const isWaitlist = isVisitCenterAppointment && (isWaitListSlotSelected || isWaitListManaging);

    const addressData = {
        address: appointmentFrame.streetName ?? '',
        city: appointmentFrame.city ?? '',
        state: appointmentFrame.politicalState ?? '',
        originalFullAddress: appointmentFrame.address?.label ?? appointmentFrame.address ?? null,
        zipCode: appointmentFrame.zipCode ?? null,
    }

    const data = {
        id: appointmentFrame.id,
        appointmentTimingType,
        customerId: appointment.customerLoadedData?.id ?? null,
        comment: appointmentFrame.description,
        driver,
        vehicle,
        gmt: moment().utcOffset(),
        offerId: appointment.appointment?.offer?.id ?? null,
        reminderTypes: appointmentFrame.reminders,
        serviceCenterId: id,
        advisor: {
            id: appointmentFrame.advisor?.id ?? appointmentFrame?.slotsConsultantId,
            isAnySelected: !(Boolean(appointmentFrame.advisor))
        },
        transportationOptionId,
        slot,
        serviceRequestIds,
        date,
        serviceCategoryIds: getCategories(categories.allCategories, appointmentFrame.categoriesIds),
        maintenancePackageOption,
        valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id
            ? [appointmentFrame?.valueService?.selectedService.id]
            : [],
        searchTerm: appointment.customerEnteredEmail,
        serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
        recalls: mapRecallsForRequest(appointmentFrame.selectedRecalls),
        schedulerType: isMobile ? EScheduler.SelfMobile : EScheduler.SelfWebsite,
        notes: appointmentFrame.appointmentNotes,
        address: appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff
            || appointmentFrame.serviceTypeOption?.type === EServiceType.MobileService
            ? addressData
            : null,
        isWaitlist,
    };

    if (isAdmin) delete data.schedulerType;

    const endpoint = appointmentFrame.hashKey
        ? Api.endpoints.Appointments.UpdateByKey
        : Api.endpoints.Appointments.Create;

    dispatch(setAppointmentSaving(true))

    Api.call<ICreateAppointmentResp>(endpoint, { data, urlParams: {id: appointmentFrame.hashKey} })
        .then(({data}) => {
            dispatch(setEditingPosition(null))
            dispatch(handleAppointmentResponse(data, endpoint, onNext))
        })
        .catch(e => {
            onError(e)
        })
        .finally(() => {
            dispatch(setAppointmentSaving(false))
        })
}

export const checkCarIsValid = (onCarIsValid = () => {}, onCarIsInvalid = () => {}, skipEngineCheck?: boolean): AppThunk => (dispatch, getState) => {
    const {selectedVehicle, makes} = getState().appointmentFrame;
    const {engineTypes, mileage} = getState().vehicleDetails;
    const {currentConfig} = getState().bookingFlowConfig;
    let carIsValid = true;
    if (selectedVehicle) {
        const models = makes.map(item => item.models).flat();
        if (!selectedVehicle.mileage) carIsValid = false;
        const existingMileage = mileage.find(item => item.value.toString() === selectedVehicle?.mileage?.toString());
        if (mileage.length && !existingMileage) carIsValid = false;
        const existingEngineType = engineTypes.find(item => item.id === selectedVehicle.engineTypeId);
        if (!skipEngineCheck && currentConfig?.engineType && (!existingEngineType || !selectedVehicle.engineTypeId)) carIsValid = false;

        if (!selectedVehicle.vin?.length && selectedVehicle.make && selectedVehicle.model) {
            const existingMake = makes.find(item => item.name.toLowerCase() === selectedVehicle.make.toLowerCase())
            const existingModel = models.find(item => item.toLowerCase() === selectedVehicle.model.toLowerCase())
            if (!existingMake || !existingModel) carIsValid = false;
        }
    } else {
        carIsValid = false;
    }
    carIsValid
        ? onCarIsValid()
        : onCarIsInvalid()
    dispatch(setCarIsValidForUpdate(carIsValid));
}

export const loadAppointmentRequestsPrices = (serviceCenterId: number): AppThunk => (dispatch, getState) =>{
    const appointmentFrame = getState().appointmentFrame;
    const appointment = getState().appointment;
    const categories = getState().categories;
    const [make, model, year] = getVehicleData(appointmentFrame.selectedVehicle, appointmentFrame.valueService);

    dispatch(setAppointmentsLoading(true))

    const vehicle = {
        engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId ? Number(appointmentFrame.selectedVehicle?.engineTypeId) : null,
        model,
        make,
        year,
        vin: appointmentFrame.selectedVehicle?.vin ?? '',
        mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
    }
    const date = appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff && appointment.serviceValetAppointment
        ? moment(appointment.serviceValetAppointment.date).toISOString().split("T")[0] || ""
        : appointment.appointment
            ? appointment.appointment?.id.split("|")[0] || ""
            : appointmentFrame.appointmentByKey?.dateInUtc || ""

    const appointmentTimingType = appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff && appointmentFrame.selectedTiming
        ? appointmentFrame.selectedTiming
        : EAppointmentTimingType.FirstAvailable;

    const serviceRequestIds = collectServiceRequestIds(
        appointmentFrame.service,
        appointmentFrame.subService,
        appointmentFrame.selectedPackage,
        appointment.selectedSR,
    )

    const time = appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? "00:00:00"
        : appointment.appointment?.id
            ? appointment.appointment?.id.split("|")[1]
            : appointmentFrame.appointmentByKey?.timeSlot || "00:00:00"

    const maintenancePackageOption = appointmentFrame.selectedPackage
        ? {id: appointmentFrame.selectedPackage?.id, priceType: appointmentFrame.packagePricingType}
        : appointmentFrame.packageEMenuType !== null
            ? {optionType: appointmentFrame.packageEMenuType}
            : null;
    const data = {
        serviceRequestIds,
        serviceCategoryIds: getCategories(categories.allCategories, appointmentFrame.categoriesIds),
        valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id
            ? [appointmentFrame?.valueService?.selectedService.id]
            : [],
        recalls: mapRecallsForRequest(appointmentFrame.selectedRecalls),
        maintenancePackageOption,
        date,
        time,
        serviceCenterId,
        appointmentTimingType,
        consultantId: appointmentFrame.advisor?.id ?? appointmentFrame?.slotsConsultantId,
        zipCode: appointmentFrame.zipCode ?? null,
        serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
        vehicle,
    }
    if (serviceRequestIds.length || data.serviceCategoryIds.length || data.valueServiceOfferIds.length
        || data.recalls.length || maintenancePackageOption) {
        Api.call(Api.endpoints.AppointmentPricing.GetPriceList, {data})
            .then(result => {
                if (result) dispatch(getAppointmentRequestsPrices(result.data))
            })
            .catch(err => {
                console.log('get appointment requests prices list err', err)
            })
            .finally(() => dispatch(setAppointmentsLoading(false)))
    }
}