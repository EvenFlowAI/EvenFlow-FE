import {createReducer} from "@reduxjs/toolkit";
import {
    getMakes,
    getModels, selectCategoriesIds,
    selectService,
    selectSubService, setAdditionalServicesChosen,
    setAdvisor,
    setAppointmentId, setConsultants, setCurrentFrameScreen,
    setCustomer,
    setFrameDescription, setLoadingPackages,
    setMaintenanceDetails,
    setPackage, setPackageIsSelected, setPackages,
    setReminders,
    setTime,
    setTiming, setTrackerCreated,
    setTransportation,
    setUpdateAppointment,
    setVehicle, updateVehicle
} from "./actions";
import {
    EServiceCategoryPage,
    ICustomer,
    ILoadedVehicle, IMake, IPackage,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType} from "../appointment/types";
import {TMaintenanceDetails} from "./types";
import {tellMoreCard} from "./initial";
import {TScreen} from "../../../components/Layout/types";

type TState = {
    service: IServiceCategory|null;
    id?: number;
    hashKey?: string;
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
    categoriesIds: number[];
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
        email: ""
    },
    reminders: [0, 2],
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
        const c: Partial<TState> = {};
        let category = payload.serviceCategory;
        if (category) {
            category = {...category, serviceRequests: category.serviceRequests ? [...category.serviceRequests] : []}
            if (category.page === EServiceCategoryPage.Page1) {
                c.service = category;
            } else if (category.page === EServiceCategoryPage.Page2) {
                c.subService = category;
                c.service = tellMoreCard;
            } else {
                // TODO: Package??
            }
        }
        return {
            ...state,
            id: payload.id,
            hashKey: payload.hashKey,
            customer: {...payload.driver},
            reminders: payload.reminderTypes,
            ...c,
            description: payload.comment
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
        return {...state, categoriesIds:
                state.categoriesIds.includes(payload)
                    ? state.categoriesIds.filter(item => item === payload)
                    : [...state.categoriesIds, payload]
        }
    })
)