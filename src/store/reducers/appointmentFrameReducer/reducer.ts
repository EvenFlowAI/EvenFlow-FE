import {createReducer} from "@reduxjs/toolkit";
import {
    getMakes,
    getModels,
    getSlotsGap,
    selectCategoriesIds,
    getSeriesModels,
    getValueServiceOffers,
    selectService,
    selectSubService,
    setAdditionalServicesChosen,
    setAddress,
    setAdvisor,
    setAppointmentId,
    setConsultants,
    setCurrentFrameScreen,
    setCustomer,
    setFrameDescription,
    setLoadingPackages,
    setMaintenanceDetails,
    setPackage,
    setPackageIsSelected,
    setPackages,
    setReminders,
    setSelectedPackageOptionType,
    setServiceType,
    setOffersLoading,
    setTime,
    setTiming,
    setTrackerCreated,
    setTransportation,
    setUpdateAppointment,
    setUserType,
    setVehicle,
    setZipCode,
    updateVehicle,
    setValueService,
    setSideBarSteps,
    setMobileServiceAvailability,
    setPickUpDropOffAvailability,
    setValueServiceAvailability,
    setWelcomeScreenView,
    switchLanguage,
    setAncillaryPriceLoading,
    setAncillaryPriceByZip, setFilteredZipCodes, setSelectedRecalls, setRecallsAreShown, setHoursOfOperations,
} from "./actions";
import {
    ICustomer,
    ILoadedVehicle, IMake, IPackage,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType} from "../appointment/types";
import {
    IServiceOffer,
    IValueService,
    TMaintenanceDetails,
    TYear,
    EServiceType,
    EUserType,
    TLanguage,
    TAncillaryPriceByZip
} from "./types";
import {TScreen} from "../../../components/Layout/types";
import {TView} from "../../../components/Welcome/types";
import {IRecallByVin} from "../../../components/AppointmentFlow/AppointmentFrame/types";
import {IHOODataForm} from "../serviceCenters/types";

type TState = {
    service: IServiceCategory|null;
    subService: IServiceCategory|null;
    description: string;
    selectedPackage: IPackageOptions|null;
    advisor: IServiceConsultant|null;
    selectedTiming: EAppointmentTimingType|null;
    selectedTime: moment.Moment|null;
    selectedVehicle: ILoadedVehicle|null;
    customer: ICustomer;
    reminders: EReminderType[];
    transportation: ITransportation|null;
    maintenanceDetails: TMaintenanceDetails;
    packages: IPackage[];
    isPackagesLoading: boolean;
    consultants: IServiceConsultant[];
    currentScreen: TScreen | '';
    makes: IMake[];
    models: string[];
    trackerCreated: boolean;
    isAdditionalServices: boolean;
    packageIsSelected: boolean;
    packageOptionType: number | null;
    categoriesIds: number[];
    id?: number;
    hashKey?: string;
    gap: number | undefined;
    userType: EUserType | undefined;
    serviceType: EServiceType;
    address: any;
    zipCode: string;
    valueService: IValueService | null;
    seriesModels: TYear[];
    offersLoading: boolean;
    serviceOffers: IServiceOffer[];
    isMobileServiceOn: boolean;
    isPickUpDropOffServiceOn: boolean;
    isValueServiceOn: boolean;
    sideBarSteps: TScreen[];
    welcomeScreenView: TView;
    language: TLanguage;
    ancillaryPriceLoading: boolean;
    ancillaryPrice: TAncillaryPriceByZip|null;
    filteredZipCodes: string[];
    selectedRecalls: IRecallByVin[];
    recallsAreShown: boolean;
    hoursOfOperations: IHOODataForm[];
}
const initialState: TState = {
    service: null,
    subService: null,
    selectedPackage: null,
    description: "",
    advisor: null,
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
    currentScreen: '',
    makes: [],
    models: [],
    trackerCreated: false,
    isAdditionalServices: false,
    packageIsSelected: false,
    categoriesIds: [],
    packageOptionType: null,
    gap: undefined,
    userType: undefined,
    serviceType: EServiceType.VisitCenter,
    address: null,
    zipCode: "",
    valueService: null,
    seriesModels: [],
    offersLoading: false,
    serviceOffers: [],
    isMobileServiceOn: false,
    isPickUpDropOffServiceOn: false,
    isValueServiceOn: false,
    sideBarSteps: [],
    welcomeScreenView: "select",
    language: "en",
    ancillaryPriceLoading: false,
    ancillaryPrice: null,
    filteredZipCodes: [],
    selectedRecalls: [],
    recallsAreShown: false,
    hoursOfOperations: [],
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
        return {...state, advisor: payload};
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
            serviceType: payload.serviceType,
            address: payload.address ?? null,
            zipCode: payload.zipCode ?? "",
            // selectedPackage: payload.maintenancePackageOption ?? null,
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
        return {...state, currentScreen: payload};
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
    .addCase(setServiceType, (state, { payload }) => {
        return {...state, serviceType: payload};
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
)