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
import {IAppointmentId, TMaintenanceDetails} from "./types";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {TScreen} from "../../../components/Layout/types";

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
export const setSelectedPackageOptionType = createAction<number>('fAppointment/SetSelectedPackageOptionType');
export const selectCategoriesIds = createAction<number[]>('fAppointment/SelectCategoriesIds')

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