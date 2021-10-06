import {createAction} from "@reduxjs/toolkit";
import {
    ICustomer, IListAppointment,
    ILoadedVehicle, IPackage,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import moment from "moment";
import {EAppointmentTimingType, EReminderType, IVehicle} from "../appointment/types";
import {IAppointmentId, TMaintenanceDetails} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";

export const selectService = createAction<IServiceCategory>("fAppointment/selectService");
export const selectSubService = createAction<IServiceCategory>("fAppointment/selectSubService");
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
export const setUpdateAppointment = createAction<IListAppointment>("fAppointment/setUpdateAppointment");
export const setLoadingPackages = createAction<boolean>("fAppointment/loadingPackages");
export const setPackages = createAction<IPackage[]>('fAppointment/setPackages');

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
