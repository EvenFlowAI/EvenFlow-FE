import {createAction} from "@reduxjs/toolkit";
import {IAppointment, IAppointmentByKey, IPackageAppointments, IVehicleForRequest} from "../../../api/types";
import {
    EConsultantRole,
    IAppointmentsRequest,
    ICheckPodRequest,
    TScheduler,
    TServiceBook,
    TServiceConsultant
} from "./types";
import {AppThunk, IPageRequest, TArgCallback, TCallback} from "../../../types/types";
import {API} from "../../../api/api";
import {EServiceType} from "../appointmentFrameReducer/types";
import {EAppointmentTimingType} from "../appointment/types";
import {
    loadConsultantsForCloning,
    setAppointmentSaving, setConsultants, setSelectedRecalls,
    updateRecalls
} from "../appointmentFrameReducer/actions";
import {setChangesCompletedOpen, setSlotsWarningOpen} from "../modals/actions";
import {collectServiceRequestIds, getCategories, getVehicleData, mapRecallsForRequest} from "../../../utils/utils";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {
    getAppointmentSlots,
    getServiceValetSlots,
    selectAppointment,
    selectServiceValetAppointment
} from "../appointment/actions";
import {getRecallsByVin} from "../recall/actions";

export const getAppointments = createAction<IAppointment[]>("Appointments/GetAppointments");
export const getAllAppointments = createAction<IAppointment[]>("Appointments/GetAllAppointments");
export const setAppointmentsLoading = createAction<boolean>("Appointments/SetAppointmentsLoading");
export const setAppointmentsModalLoading = createAction<boolean>("Appointments/SetAppointmentsModalLoading");
export const setAppointmentsCount = createAction<number>("Appointments/SetAppointmentsCount");
export const setAllAppointmentsCount = createAction<number>("Appointments/SetAllAppointmentsCount");
export const getPackageByVehicle = createAction<IPackageAppointments[]>("Appointments/GetPackageByVehicle");
export const getServiceBookList = createAction<TServiceBook[]>("Appointments/GetServiceBookList");
export const getScheduler = createAction<TScheduler[]>("Appointments/GetSchedulerList");
export const getAppointmentsPageData = createAction<Partial<IPageRequest>>("Appointments/GetPageData");
export const getAdvisorsList = createAction<TServiceConsultant[]>("Appointments/GetServiceAdvisors");
export const getTechnicians = createAction<TServiceConsultant[]>("Appointments/GetTechnicians");
export const getCurrentAppointment = createAction<IAppointmentByKey|null>("Appointments/getCurrentAppointment");
export const setCurrentAppointmentLoading = createAction<boolean>("Appointments/SetCurrentAppointmentLoading");

export const loadAppointments = (data: IAppointmentsRequest): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true));
    API.appointment.list(data)
        .then(({data: {paging, result}}) => {
            if (data.pageIndex === 0 && data.pageSize === 0 && !data.startDate && !data.endDate) {
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
        .finally(() => setTimeout(() => dispatch(setAppointmentsLoading(false)), 500))
}

export const checkPodChanged = (serviceCenterId: number, onError: TArgCallback<any>, onPodKept?: () => void): AppThunk => (dispatch, getState) => {
    const appointmentFrame = getState().appointmentFrame;
    const appointment = getState().appointment;
    const categories = getState().categories;

    const [make, model, year] = getVehicleData(appointmentFrame.selectedVehicle, appointmentFrame.valueService);

    const vehicle: IVehicleForRequest = {
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
        advisor: {
            id: appointmentFrame.advisor?.id,
            isAnySelected: !(Boolean(appointmentFrame.advisor))
        },
        vehicle,
    }
    if (appointmentFrame?.appointmentByKey?.hashKey) {
        dispatch(setAppointmentSaving(true))
        Api.call(Api.endpoints.Appointments.CheckPodChanged, {data, urlParams: {key: appointmentFrame?.appointmentByKey?.hashKey}})
            .then(result => {
                if (result?.data) {
                    dispatch(setSlotsWarningOpen(true));
                } else {
                    if (onPodKept) {
                        onPodKept()
                    } else {
                        dispatch(setChangesCompletedOpen(true))
                    }
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

export const loadSchedulerList = (): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true))
    Api.call(Api.endpoints.Appointments.GetSchedulers)
        .then(result => {
            if (result) dispatch(getScheduler(result.data))
        })
        .catch(e => {
            console.log('get scheduler list error', e)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const loadServiceConsultants = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setAppointmentsLoading(true))
    Api.call<TServiceConsultant[]>(Api.endpoints.ServiceConsultants.GetByRole, {params: {serviceCenterId, roles: ["Advisor", "Technician"]}})
        .then(result => {
            if (result?.data) {
                dispatch(getAdvisorsList(result.data.filter(item => item.role === EConsultantRole.Advisor)))
                dispatch(getTechnicians(result.data.filter(item => item.role === EConsultantRole.Technician)))
            }
        })
        .catch(e => {
            console.log('load Service Consultants error', e)
        })
        .finally(() => dispatch(setAppointmentsLoading(false)))
}

export const loadAppointmentByKey = (key: string, serviceCenterId: string, cb: TCallback): AppThunk => async dispatch => {
    dispatch(setCurrentAppointmentLoading(true))
    try {
        const {data} = await API.appointment.getByKey(key);
        if (data) {
            dispatch(getCurrentAppointment(data));
            dispatch(updateRecalls(data, serviceCenterId));
            dispatch(loadConsultantsForCloning(serviceCenterId, data, cb))
        }
    } catch {
        dispatch(setCurrentAppointmentLoading(false))
    }
}

export const onClearAfterCloning = (): AppThunk => dispatch => {
    dispatch(getCurrentAppointment(null))
    dispatch(selectAppointment(null))
    dispatch(selectServiceValetAppointment(null))
    dispatch(setConsultants([]));
    dispatch(getAppointmentSlots([]));
    dispatch(getServiceValetSlots([]));
    dispatch(getRecallsByVin([]))
    dispatch(setSelectedRecalls([]))
}

