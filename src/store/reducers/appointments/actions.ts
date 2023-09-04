import {createAction} from "@reduxjs/toolkit";
import {IAppointment, ILoadedVehicle, IPackageAppointments} from "../../../api/types";
import {IAppointmentsRequest, ICheckPodRequest, IPackageRequestData, TScheduler, TServiceBook} from "./types";
import {AppThunk, TArgCallback} from "../../../types/types";
import {API} from "../../../api/api";
import {Api} from "../../../config/requests";
import {
    collectServiceRequestIds,
    getCategories,
    getVehicleData, mapRecallsForRequest
} from "../../../components/AppointmentFlow/AppointmentFrame/utils";
import {EServiceType} from "../appointmentFrameReducer/types";
import {EAppointmentTimingType} from "../appointment/types";
import {setAppointmentSaving} from "../appointmentFrameReducer/actions";
import {setChangesCompletedOpen, setSlotsWarningOpen} from "../modals/actions";

export const getAppointments = createAction<IAppointment[]>("Appointments/GetAppointments");
export const getAllAppointments = createAction<IAppointment[]>("Appointments/GetAllAppointments");
export const setAppointmentsLoading = createAction<boolean>("Appointments/SetAppointmentsLoading");
export const setAppointmentsModalLoading = createAction<boolean>("Appointments/SetAppointmentsModalLoading");
export const setAppointmentsCount = createAction<number>("Appointments/SetAppointmentsCount");
export const setAllAppointmentsCount = createAction<number>("Appointments/SetAllAppointmentsCount");
export const getPackageByVehicle = createAction<IPackageAppointments[]>("Appointments/GetPackageByVehicle");
export const getServiceBookList = createAction<TServiceBook[]>("Appointments/GetServiceBookList");
export const getScheduler = createAction<TScheduler[]>("Appointments/GetSchedulerList");

export const loadAppointments = (data: IAppointmentsRequest): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true));
    API.appointment.list(data)
        .then(({data: {paging, result}}) => {
            if (data.pageIndex === 0 && data.pageSize === 0 && !data.date) {
                dispatch(getAllAppointments(result));
                dispatch(setAllAppointmentsCount(paging.numberOfRecords));
            } else {
                dispatch(getAppointments(result));
                dispatch(setAppointmentsCount(paging.numberOfRecords));
            }
        })
        .catch(err => {
            console.log('load appointments for calendar', err)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const loadAppointmentsForModal = (data: IAppointmentsRequest): AppThunk => dispatch => {
    dispatch(setAppointmentsModalLoading(true));
    API.appointment.list(data)
        .then(({data: {paging, result}}) => {
            if (data.pageIndex === 0 && data.pageSize === 0 && !data.date) {
                dispatch(getAllAppointments(result));
                dispatch(setAllAppointmentsCount(paging.numberOfRecords));
            } else {
                dispatch(getAppointments(result));
                dispatch(setAppointmentsCount(paging.numberOfRecords));
            }
        })
        .catch(err => {
            console.log('load appointments for calendar', err)
        })
        .finally(() => dispatch(setAppointmentsModalLoading(false)))
}

export const loadPackageByVehicle = (data: IPackageRequestData): AppThunk => dispatch => {
    dispatch(setAppointmentsModalLoading(true));
    Api.call<IPackageAppointments[]>(Api.endpoints.MaintenancePackages.ByVehicle, {data})
        .then(({data}) => {
            if (data && data[0]) {
                dispatch(getPackageByVehicle([data[0]]))
            } else {
               dispatch(getPackageByVehicle([]));
            }
        })
        .catch(err => {
            dispatch(getPackageByVehicle([]));
            console.log('load package by vehicle', err)
        })
        .finally(() => dispatch(setAppointmentsModalLoading(false)))
}

export const checkPodChanged = (serviceCenterId: number, onError: TArgCallback<any>): AppThunk => (dispatch, getState) => {
    const appointmentFrame = getState().appointmentFrame;
    const appointment = getState().appointment;
    const categories = getState().categories;

    const [make, model, year] = getVehicleData(appointmentFrame.selectedVehicle, appointmentFrame.valueService);

    const vehicle: ILoadedVehicle = {
        ...(appointmentFrame.selectedVehicle ?? {}),
        engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId ? Number(appointmentFrame.selectedVehicle?.engineTypeId) : null,
        model: model ?? "",
        make: make ?? "",
        year: year ? +year : null,
        vin: appointmentFrame.selectedVehicle?.vin ?? '',
        mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
        appointmentHashKeys: [],
    }

    delete vehicle.appointmentHashKeys;

    const appointmentTimingType = appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff
    && appointmentFrame.selectedTiming
        ? appointmentFrame.selectedTiming
        : EAppointmentTimingType.FirstAvailable;

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
    const data: ICheckPodRequest = {
        serviceRequestIds,
        serviceCategoryIds: getCategories(categories.allCategories, appointmentFrame.categoriesIds),
        valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id
            ? [appointmentFrame?.valueService?.selectedService.id]
            : [],
        recalls: mapRecallsForRequest(appointmentFrame.selectedRecalls),
        maintenancePackageOption,
        appointmentTimingType,
        serviceCenterId,
        serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
        zipCode: appointmentFrame.zipCode ?? null,
        address: appointmentFrame.address?.label ?? appointmentFrame.address ?? null,
        consultantId: appointmentFrame.advisor?.id ?? appointmentFrame?.slotsConsultantId,
        vehicle,
    }
    if (appointmentFrame?.appointmentByKey?.hashKey) {
        dispatch(setAppointmentSaving(true))
        Api.call(Api.endpoints.Appointments.CheckPodChanged, {data, urlParams: {key: appointmentFrame?.appointmentByKey?.hashKey}})
            .then(result => {
                if (result?.data) {
                    dispatch(setSlotsWarningOpen(true));
                } else {
                    dispatch(setChangesCompletedOpen(true))
                }
            })
            .catch(e => {
                console.log(e)
                onError(e)
        })
            .finally(() => {
                dispatch(setAppointmentSaving(false))
            })
    }
}

export const loadServiceBookList = (id: number): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true))
    Api.call(Api.endpoints.Appointments.GetServiceBooks, {urlParams: {id}})
        .then(result => {
            if (result) dispatch(getServiceBookList(result.data))
        })
        .catch(e => {
            console.log('get service book list error', e)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const loadSchedulerList = (id: number): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true))
    Api.call(Api.endpoints.Appointments.GetSchedulers, {urlParams: {id}})
        .then(result => {
            if (result) dispatch(getScheduler(result.data))
        })
        .catch(e => {
            console.log('get scheduler list error', e)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}
