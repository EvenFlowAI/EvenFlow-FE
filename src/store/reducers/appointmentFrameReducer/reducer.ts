import {createReducer} from "@reduxjs/toolkit";
import {
    deleteLastScreen,
    getAppointmentRequestsPrices,
    getMakes,
    getModels,
    getSeriesModels,
    getSlotsGap,
    getTransactionValue,
    getValueServiceOffers,
    selectCategoriesIds,
    selectService,
    selectSubService, setAcceptedConsentIds,
    setAdditionalServicesChosen,
    setAddress,
    setAdvisor,
    setAncillaryPriceByZip,
    setAncillaryPriceLoading,
    setAnyAdvisorSelected,
    setAppointmentByKey,
    setAppointmentId,
    setAppointmentNotes,
    setAppointmentSaving,
    setCarIsValidForUpdate,
    setCity,
    setConsultants,
    setConsultantsLoading,
    setCurrentFrameScreen,
    setCustomer,
    setEditingPosition,
    setFilteredZipCodes,
    setFrameDescription,
    setHashKey,
    setHoursOfOperations,
    setLoadingPackages,
    setMaintenanceDetails,
    setMobileServiceAvailability,
    setOffersLoading,
    setPackage,
    setPackageEMenuType,
    setPackageIsSelected,
    setPackagePricingType,
    setPackages,
    setPassedScreens,
    setPickUpDropOffAvailability,
    setPoliticalState,
    setRecallsAreShown,
    setReminders,
    setSelectedPackageOptionType,
    setSelectedPackagePriceTitles,
    setSelectedRecalls,
    setSelectedServiceTypeOptions,
    setServiceOptionChanged,
    setServiceTypeOption,
    setShowServiceCentersList,
    setSideBarActualSteps,
    setSideBarMenu,
    setSideBarSteps,
    setSideBarStepsList,
    setStreetName,
    setTime,
    setTiming,
    setTrackerCreated,
    setTransportation,
    setUpdateAppointment,
    setUserType,
    setUsualFlowNeeded,
    setValueService,
    setValueServiceAvailability,
    setVehicle,
    setWelcomeScreenView,
    setZipCode,
    switchLanguage,
    updateVehicle,
} from "./actions";
import {EAppointmentTimingType} from "../appointment/types";
import {EServiceType, TState} from "./types";
import {getSlotsConsultantId} from "../appointment/actions";

const initialState: TState = {
    service: null,
    subService: null,
    selectedPackage: null,
    description: "",
    advisor: null,
    isAnyAdvisorSelected: false,
    selectedTime: null,
    selectedTiming: null,
    selectedVehicle: null,
    customer: {
        fullName: "",
        phoneNumber: "",
        email: "",
        city: "",
    },
    reminders: [],
    transportation: null,
    maintenanceDetails: {},
    packages: [],
    isPackagesLoading: false,
    consultants: [],
    isConsultantsLoading: false,
    currentScreen: '',
    prevScreen: '',
    makes: [],
    models: [],
    trackerCreated: false,
    isAdditionalServices: false,
    packageIsSelected: false,
    categoriesIds: [],
    packageOptionType: null,
    gap: undefined,
    userType: undefined,
    address: null,
    politicalState: '',
    city: '',
    zipCode: "",
    streetName: "",
    valueService: null,
    seriesModels: [],
    offersLoading: false,
    serviceOffers: [],
    isMobileServiceOn: false,
    isPickUpDropOffServiceOn: false,
    isValueServiceOn: false,
    sideBarSteps: [],
    sideBarMenu: [],
    sideBarActualSteps: null,
    sideBarStepsList: [],
    welcomeScreenView: "select",
    language: "en",
    ancillaryPriceLoading: false,
    ancillaryPrice: null,
    filteredZipCodes: [],
    selectedRecalls: [],
    recallsAreShown: false,
    hoursOfOperations: [],
    serviceTypeOption: null,
    prevSelectedOption: null,
    selectedOptionTypes: [],
    selectedServiceOptions: [],
    packagePricingType: null,
    packagePriceTitles: [],
    packageEMenuType: null,
    slotsConsultantId: null,
    shouldShowServiceCentersList: true,
    isAppointmentSaving: false,
    appointmentByKey: null,
    carIsValidForUpdate: true,
    isUsualFlowNeeded: false,
    editingPosition: null,
    appointmentRequestsPrices: [],
    appointmentNotes: '',
    serviceOptionChangedFromSlotPage: false,
    transactionValue: 0,
    passedScreens: [],
    consents: [],
    acceptedConsentIds: [],
};

export const appointmentFrameReducer = createReducer(initialState, builder => builder
    .addCase(selectService, (state, {payload}) => {
        return {
            ...state,
            service: payload,
            subService: null,
        };
    })
    .addCase(selectSubService, (state, {payload}) => {
        return {...state, subService: payload};
    })
    .addCase(setFrameDescription, (state, {payload}) => {
        return {...state, description: payload};
    })
    .addCase(setPackage, (state, {payload}) => {
        return {...state, selectedPackage: payload};
    })
    .addCase(setAdvisor, (state, {payload}) => {
        return {...state, advisor: payload, slotsConsultantId: payload ? null : state.slotsConsultantId};
    })
    .addCase(setAnyAdvisorSelected, (state, {payload}) => {
        return {...state, isAnyAdvisorSelected: payload};
    })
    .addCase(setTiming, (state, {payload}) => {
        return {
            ...state,
            selectedTiming: payload,
            selectedTime: payload !== EAppointmentTimingType.PreferredDate ? null : state.selectedTime
        };
    })
    .addCase(setTime, (state, {payload}) => {
        return {...state, selectedTime: payload};
    })
    .addCase(setVehicle, (state, {payload}) => {
        return {...state, selectedVehicle: payload, id: undefined, hashKey: undefined};
    })
    .addCase(updateVehicle, (state, {payload}) => {
        if (state.selectedVehicle) {
            return {...state, selectedVehicle: {...state.selectedVehicle, ...payload}}
        }
        return state;
    })
    .addCase(setCustomer, (state, {payload}) => {
        return {...state, customer: payload};
    })
    .addCase(setReminders, (state, {payload}) => {
        return {...state, reminders: payload};
    })
    .addCase(setAppointmentId, (state, {payload}) => {
        let vehicle = state.selectedVehicle;
        if (vehicle) {
            vehicle = {...vehicle, appointmentHashKeys: [...vehicle.appointmentHashKeys, payload.hashKey]}
        }
        return {...state, ...payload, selectedVehicle: vehicle};
    })
    .addCase(setTransportation, (state, {payload}) => {
        return {...state, transportation: payload};
    })
    .addCase(setMaintenanceDetails, (state, {payload}) => {
        return {...state, maintenanceDetails: {...state.maintenanceDetails, ...payload}}
    })
    .addCase(setUpdateAppointment, (state, {payload}) => {
        return {
            ...state,
            id: payload.id,
            hashKey: payload.hashKey,
            customer: {...payload.driver},
            reminders: payload.reminderTypes,
            categoriesIds: payload.serviceCategories ? payload.serviceCategories?.map(item => item.id) : [],
            description: payload.comment,
            serviceType: payload.serviceTypeOption?.type ?? EServiceType.VisitCenter,
            address: payload.address?.fullAddress ?? null,
            zipCode: payload.address?.zipCode ?? "",
            serviceTypeOption: payload.serviceTypeOption ?? null,
            transportation: payload.transportationOption ?? null,
            appointmentRequestsPrices: payload.detailedPriceList ?? [],
            city: payload?.address?.city ?? '',
            streetName: payload?.address?.address ?? '',
            politicalState: payload?.address?.state ?? '',
            packagePricingType: payload?.maintenancePackageOption?.priceType ?? null,
        };
    })
    .addCase(setLoadingPackages, (state, { payload}) => {
        return {...state, isPackagesLoading: payload}
    })
    .addCase(setPackages, (state, { payload}) => {
        return {...state, packages: payload}
    })
    .addCase(setConsultants, (state, { payload}) => {
        return {...state, consultants: payload};
    })
    .addCase(setCurrentFrameScreen, (state, { payload }) => {
        return {
            ...state,
            prevScreen: state.currentScreen,
            currentScreen: payload,
            passedScreens: [...state.passedScreens, payload]
        };
    })
    .addCase(getMakes, (state, { payload }) => {
        return {...state, makes: payload }
    })
    .addCase(getModels, (state, { payload }) => {
        return {...state, models: payload }
    })
    .addCase(setTrackerCreated, (state, { payload }) => {
        return {...state, trackerCreated: payload}
    })
    .addCase(setAdditionalServicesChosen, (state, {payload}) => {
        return {...state, isAdditionalServices: payload};
    })
    .addCase(setPackageIsSelected, (state, {payload}) => {
        return {...state, packageIsSelected: payload};
    })
    .addCase(selectCategoriesIds, (state, {payload}) => {
        return {...state, categoriesIds: payload};
    })
    .addCase(setSelectedPackageOptionType, (state, {payload}) => {
        return {...state, packageOptionType: payload};
    })
    .addCase(getSlotsGap, (state, {payload}) => {
        return {...state, gap: payload};
    })
    .addCase(setUserType, (state, {payload}) => {
        return {...state, userType: payload};
    })
    .addCase(setAddress, (state, { payload }) => {
        return {...state, address: payload};
    })
    .addCase(setZipCode, (state, { payload }) => {
        return {...state, zipCode: payload};
    })
    .addCase(setValueService, (state, {payload}) => {
        return {...state, valueService: payload};
    })
    .addCase(getSeriesModels, (state, {payload}) => {
        return {...state, seriesModels: payload}
    })
    .addCase(getValueServiceOffers, (state, {payload}) => {
        return {...state, serviceOffers: payload}
    })
    .addCase(setOffersLoading, (state, {payload}) => {
        return {...state, offersLoading: payload}
    })
    .addCase(setSideBarSteps, (state, {payload}) => {
        return {...state, sideBarSteps: payload}
    })
    .addCase(setMobileServiceAvailability, (state, {payload}) => {
        return {...state, isMobileServiceOn: payload}
    })
    .addCase(setPickUpDropOffAvailability, (state, {payload}) => {
        return {...state, isPickUpDropOffServiceOn: payload}
    })
    .addCase(setValueServiceAvailability, (state, {payload}) => {
        return {...state, isValueServiceOn: payload}
    })
    .addCase(setWelcomeScreenView, (state, {payload}) => {
        return {...state, welcomeScreenView: payload}
    })
    .addCase(switchLanguage, (state, {payload}) => {
        return {...state, language: payload}
    })
    .addCase(setAncillaryPriceLoading, (state, {payload}) => {
        return {...state, ancillaryPriceLoading: payload}
    })
    .addCase(setAncillaryPriceByZip, (state, {payload}) => {
        return {...state, ancillaryPrice: payload}
    })
    .addCase(setFilteredZipCodes, (state, {payload}) => {
        return {...state, filteredZipCodes: payload}
    })
    .addCase(setSelectedRecalls, (state, {payload}) => {
        return {...state, selectedRecalls: payload}
    })
    .addCase(setRecallsAreShown, (state, {payload}) => {
        return {...state, recallsAreShown: payload}
    })
    .addCase(setHoursOfOperations, (state, {payload}) => {
        return {...state, hoursOfOperations: payload}
    })
    .addCase(setServiceTypeOption, (state, {payload}) => {
        const optionsTypes = payload
            ?  Array.from(new Set([...state.selectedOptionTypes, payload.type]))
            : state.selectedOptionTypes;
        const optionIsInTheList = state.selectedServiceOptions.find(el => el.id === payload?.id);
        return {
            ...state,
            serviceTypeOption: payload,
            selectedOptionTypes: optionsTypes,
            selectedServiceOptions: payload && !optionIsInTheList ? [...state.selectedServiceOptions, payload] : state.selectedServiceOptions,
            prevSelectedOption: state.serviceTypeOption,
        };
    })
    .addCase(setPackagePricingType, (state, {payload}) => {
        return {...state, packagePricingType: payload}
    })
    .addCase(setSideBarMenu, (state, {payload}) => {
        return {...state, sideBarMenu: payload}
    })
    .addCase(setSideBarActualSteps, (state, {payload}) => {
        return {...state, sideBarActualSteps: payload}
    })
    .addCase(setSelectedPackagePriceTitles, (state, {payload}) => {
        return {...state, packagePriceTitles: payload}
    })
    .addCase(setSideBarStepsList, (state, {payload}) => {
        return {...state, sideBarStepsList: payload}
    })
    .addCase(setPackageEMenuType, (state, {payload}) => {
        return {...state, packageEMenuType: payload}
    })
    .addCase(getSlotsConsultantId, (state, {payload}) => {
        return {...state, slotsConsultantId: payload}
    })
    .addCase(setShowServiceCentersList, (state, {payload}) => {
        return {...state, shouldShowServiceCentersList: payload}
    })
    .addCase(setAppointmentSaving, (state, {payload}) => {
        return {...state, isAppointmentSaving: payload}
    })
    .addCase(setHashKey, (state, {payload}) => {
        return {...state, hashKey: payload}
    })
    .addCase(setAppointmentByKey, (state, {payload}) => {
        return {...state, appointmentByKey: payload}
    })
    .addCase(setCarIsValidForUpdate, (state, {payload}) => {
        return {...state, carIsValidForUpdate: payload}
    })
    .addCase(setUsualFlowNeeded, (state, {payload}) => {
        return {...state, isUsualFlowNeeded: payload}
    })
    .addCase(setEditingPosition, (state, {payload}) => {
        return {...state, editingPosition: payload}
    })
    .addCase(getAppointmentRequestsPrices, (state, {payload}) => {
        return {...state, appointmentRequestsPrices: payload}
    })
    .addCase(setAppointmentNotes, (state, {payload}) => {
        return {...state, appointmentNotes: payload}
    })
    .addCase(setServiceOptionChanged, (state, {payload}) => {
        return {...state, serviceOptionChangedFromSlotPage: payload}
    })
    .addCase(setConsultantsLoading, (state, {payload}) => {
        return {...state, isConsultantsLoading: payload}
    })
    .addCase(setPoliticalState, (state, {payload}) => {
        return {...state, politicalState: payload}
    })
    .addCase(setCity, (state, {payload}) => {
        return {...state, city: payload}
    })
    .addCase(setStreetName, (state, {payload}) => {
        return {...state, streetName: payload}
    })
    .addCase(getTransactionValue, (state, {payload}) => {
        return {...state, transactionValue: payload}
    })
    .addCase(setSelectedServiceTypeOptions, (state, {payload}) => {
        return {...state, selectedServiceOptions: payload}
    })
    .addCase(setPassedScreens, (state, {payload}) => {
        return {...state, passedScreens: payload}
    })
    .addCase(setAcceptedConsentIds, (state, {payload}) => {
        return {...state, acceptedConsentIds: payload}
    })
    .addCase(deleteLastScreen, (state) => {
        const screens = state.passedScreens.slice(0, state.passedScreens.length - 1)
        return {...state, passedScreens: screens, currentScreen: screens[screens.length - 1]}
    })
)