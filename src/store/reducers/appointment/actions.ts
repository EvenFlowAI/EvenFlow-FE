import {createAction} from "@reduxjs/toolkit";
import {
    APPOINTMENT_STATE_KEY,
    APPOINTMENT_STATE_SAVED_KEY,
    EAppointmentTimingType,
    IAppointmentFilters,
    IAppointmentResponse,
    IAppointmentSlot,
    IAppointmentSlotsRequest, IDropOffSettings,
    IPersonalInformation,
    IPrivacy,
    IRemappedAppointmentSlot,
    IReminders, ISearchedDateRange,
    IServiceCenterProfile, IServiceValetAppointment,
    ISR, ISVAppointmentResponse, IWaitListData,
    TAppointmentState,
} from "./types";
import {AppThunk, PaginatedAPIResponse, TCallback, TParsableDate} from "../../../types/types";
import {
    EServiceCenterName,
    ICreateAppointmentResp,
    ICustomerLoadedData,
    ILoadedVehicle, IServiceCategory, IServiceCategoryShort,
} from "../../../api/types";
import {getSlotsGap} from "../appointmentFrameReducer/actions";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";

export const setProfileLoading = createAction<boolean>('Appointment/SetProfileLoading');
export const setTopAligning = createAction<boolean>("Appointment/SetTopAligning");
export const getServiceCenterProfile = createAction<IServiceCenterProfile>("Appointment/GetSCProfile");
export const loadSCProfile = (id: number): AppThunk => async dispatch => {
    dispatch(setProfileLoading(true))
    try {
        const {data} = await Api.call<IServiceCenterProfile>(
            Api.endpoints.ServiceCenters.Retrieve,
            {urlParams: {id}}
        )
        dispatch(getServiceCenterProfile(data));
        dispatch(setTopAligning(data?.serviceCenterFlag === EServiceCenterName.Fremont
            || data?.serviceCenterFlag === EServiceCenterName.LakePowellFord
            || data?.serviceCenterFlag === EServiceCenterName.DealerBuilt
            || data?.serviceCenterFlag === EServiceCenterName.Bountiful))
    } catch (err) {
        console.log('load sc profile err', err)
    } finally {
        await dispatch(setProfileLoading(false))
    }
}
export const getSRs = createAction<ISR[]>("Appointment/GetSRs");
export const loadSRs = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    try {
        const {data: {result}} = await Api.call<PaginatedAPIResponse<ISR>>(
            Api.endpoints.ServiceRequests.GetShort,
            {
                params: {
                    serviceCenterId, pageSize: 0,
                    searchTerm: getState().appointment.search,
                    isOnlyIndividual: true,
                }
            }
        );
        dispatch(getSRs(result));
    } catch (err) {
        console.log('load sr list err', err)
    }
}
export const selectSR = createAction<number|null>("Appointment/SelectSR");
export const selectSRMultiple = createAction<number[]>("Appointment/SelectSRMultiple")
export const handleSearch = createAction<string>("Appointment/Search");
export const changeReminders = createAction<Partial<IReminders>>("Appointment/ChangeReminders");
export const changePrivacy = createAction<Partial<IPrivacy>>("Appointment/ChangePrivacy");
export const changePersonalInformation = createAction<Partial<IPersonalInformation>>("Appointment/ChangePersonalInformation");
export const selectAppointment = createAction<IRemappedAppointmentSlot|null>("Appointment/SelectAppointment");
export const selectServiceValetAppointment = createAction<IServiceValetAppointment|null>("Appointment/SelectServiceValetAppointment");
export const getServiceCategories = createAction<IServiceCategory[]>("Appointment/GetServiceCategories");
export const getAllServiceCategories = createAction<IServiceCategoryShort[]>("Appointment/GetAllServiceCategories");
export const setLoadedDateRange = createAction<ISearchedDateRange>("Appointment/SetLoadedDateRange");
export const getAppointmentSlots = createAction<IAppointmentSlot[]>("Appointment/GetAppointmentSlots");
export const setAppointmentWasChanged = createAction<boolean>("Appointment/SetAppointmentWasChanged");
export const setWaitListSettings = createAction<IWaitListData|null>("Appointment/SetWaitListSettings");
export const setSlotPodId = createAction<number|null>("Appointment/SetSlotPodId");
export const setSlotsLoading = createAction<boolean>("Appointment/setSlotsLoading");

export const loadAppointmentSlots = (
    data: IAppointmentSlotsRequest,
    cb?: (d: TParsableDate) => void,
    loadCB?: TCallback,
    onLoadedCb?: (isEmptyList: boolean) => void
): AppThunk => async dispatch => {
    dispatch(setSlotsLoading(true))
    try {
        const {data: {items, searchedDateRange, slotGapMinutes, waitlistSettings, podId}} = await Api.call<IAppointmentResponse>(
            Api.endpoints.AppointmentSlots.GetSlots,
            {data}
        );
        const res = dispatch(getAppointmentSlots(items));
        if (slotGapMinutes) dispatch(getSlotsGap(slotGapMinutes));
        dispatch(setWaitListSettings(waitlistSettings ?? null))
        dispatch(setSlotPodId(podId ?? null));
        if (loadCB) {
            loadCB();
        }
        if (onLoadedCb) onLoadedCb(!Boolean(items.length))
        searchedDateRange && (await dispatch(setLoadedDateRange(searchedDateRange)))
        if (cb && data.appointmentTimingType === EAppointmentTimingType.FirstAvailable && searchedDateRange) {
            return cb(dayjs.utc(searchedDateRange.from));
        }
        return res;
    } catch (err) {
        onLoadedCb && onLoadedCb(true)
        return dispatch(getAppointmentSlots([]));
    } finally {
        dispatch(setSlotsLoading(false))
    }
}
export const setLoadedReducer = createAction<TAppointmentState>("Appointment/ReloadState");
export const saveAppointmentReducer = (): AppThunk => (d, getState) => {
    const state = JSON.stringify({...getState().appointment});
    localStorage.setItem(APPOINTMENT_STATE_KEY, state);
    localStorage.setItem(APPOINTMENT_STATE_SAVED_KEY, dayjs().toISOString());
}
export const clearStorage = () => {
    localStorage.removeItem(APPOINTMENT_STATE_KEY);
    localStorage.removeItem(APPOINTMENT_STATE_SAVED_KEY);
}
export const loadAppointmentReducer = (): AppThunk => async (dispatch) => {
    const date = localStorage.getItem(APPOINTMENT_STATE_SAVED_KEY);
    if (!date) {
        clearStorage();
    } else {
        if (dayjs().diff(dayjs(date), "hours") >= 1) {
            clearStorage();
        } else {
            try {
                const i = localStorage.getItem(APPOINTMENT_STATE_KEY);
                if (!i) {
                    clearStorage();
                } else {
                    const data: TAppointmentState = JSON.parse(i);
                    await dispatch(setLoadedReducer(data));
                    localStorage.setItem(APPOINTMENT_STATE_SAVED_KEY, dayjs().toISOString());
                }
            } catch {
                clearStorage();
            }
        }
    }
}
export const setOldAppointmentId = createAction<ICreateAppointmentResp&{updated: boolean}>("Appointments/SetAppointmentId");
export const setAppointmentFilters = createAction<Partial<IAppointmentFilters>>("Appointment/SetFilters");
export const setCustomerEnteredEmail = createAction<string>("Appointment/SetCustomerEnteredEmail");
export const setCustomerLoadedData = createAction<ICustomerLoadedData|null>("Appointment/SetCustomerLoadedData");

export const setSessionId = createAction<string>("Appointment/SetSessionId");
export const setEditAppointment = createAction<TAppointmentState>("Appointment/SetEditAppointment");

const CUSTOMER_CACHE = 'fCC';
export const saveCustomerCache = (data: ICustomerLoadedData): void => {
    localStorage.setItem(CUSTOMER_CACHE, JSON.stringify(data));
}
export const getBlankVehicle = (): ILoadedVehicle => ({
    year: null,
    mileage: null,
    appointmentHashKeys: [],
    vin: "",
    model: "",
    make: "",
    warrantyExpiration: null
})
export const getBlankCustomer = (sessionId?: string): ICustomerLoadedData => {
    return  {
        id: "",
        vehicles: [],
        lastName: "",
        firstName: "",
        fullName: "",
        emails: [],
        sessionId,
        phoneNumbers: [],
    };
}
export const clearCustomerCache = (): void => {
    localStorage.removeItem(CUSTOMER_CACHE);
}
export const getCustomerCache = (): ICustomerLoadedData|null => {
    try {
        const item = localStorage.getItem(CUSTOMER_CACHE);
        if (!item) {
            return null;
        }
        return JSON.parse(item) as ICustomerLoadedData;
    } catch {
        return null;
    }
}

export const loadServiceCategories = (serviceCenterId: number, page: number): AppThunk => dispatch => {
    Api.call<IServiceCategory[]>(
        Api.endpoints.ServiceCategories.GetByPage, {data: {serviceCenterId, page}}
    )
        .then(({data}) => {
            if (data) dispatch(getServiceCategories(data))
        })
        .catch(err => {
            console.log('load all service categories error', err)
        })
}

export const loadAllServiceCategories = (serviceCenterId: number): AppThunk => dispatch => {
    Api.call(
        Api.endpoints.ServiceCategories.GetShortByQuery, {data: {serviceCenterId, pageSize: 0, pageIndex: 0}}
    )
        .then(({data}) => {
            if (data?.result) dispatch(getAllServiceCategories(data.result))
        })
        .catch(err => {
            console.log('load all service categories error', err)
        })
}
export const getServiceValetSlots = createAction<IServiceValetAppointment[]>("Appointment/GetServiceValetSlots");
export const getDropOffSettings = createAction<IDropOffSettings>("Appointment/GetDropOffSettings");
export const loadServiceValetSlots = (
    data: IAppointmentSlotsRequest,
    cb?: (d: TParsableDate) => void,
    loadCB?: TCallback,
    onLoadedCb?: (isEmptyList: boolean) => void
): AppThunk => dispatch => {
    Api.call<ISVAppointmentResponse>(Api.endpoints.AppointmentSlots.GetServiceValetSlots, {data})
        .then(result => {
            const {items, searchedDateRange, dropOffSettings} = result.data;
            dispatch(getServiceValetSlots(items));
            if (searchedDateRange) dispatch(setLoadedDateRange(searchedDateRange));
            if (dropOffSettings) dispatch(getDropOffSettings(dropOffSettings));
            loadCB && loadCB();
            if (onLoadedCb) onLoadedCb(!Boolean(items.length))
        })
        .catch(err => {
            onLoadedCb && onLoadedCb(true)
            dispatch(getServiceValetSlots([]));
            console.log('get service valet slots err', err)
        })
        .finally(() => loadCB && loadCB())
}