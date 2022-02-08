import {createAction} from "@reduxjs/toolkit";
import {
    EDemandCategory,
    IDayOfWeekSetting,
    IGetMPListData,
    IPackagePricingSettings,
    IPackagePricingLevels,
    IPricingDemand,
    IPricingLevel,
    IPricingSetting, IRequestPricingSettings,
    ITimeOfYearSetting,
    ITimeWindowEl, TNewRequestsToPricing
} from "./types";
import {Api} from "../../../config/requests";
import {AppThunk, PaginatedAPIResponse} from "../../../types/types";
import {IAssignedServiceRequest} from "../serviceRequests/types";
import moment from "moment";
import {IPackageShort} from "../packages/types";

export const setLoading = createAction<boolean>("PricingSettings/SetLoading");

export const getPricingLevels = createAction<IPricingLevel[]>("PricingSettings/GetPL");
export const loadPricingLevels = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IPricingLevel[]>(
        Api.endpoints.PricingSettings.GetLevels,
        {params: {serviceCenterId}}
    );
    dispatch(getPricingLevels(data));
}
export const setPricingLevels = (data: IPricingLevel): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.PricingSettings.SetLevels, {data});
    dispatch(loadPricingLevels(data.serviceCenterId));
}

export const getTimeWindows = createAction<ITimeWindowEl[]>("PricingSettings/GetTimeWindows");
export const loadTimeWindows = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<ITimeWindowEl[]>(
        Api.endpoints.AppointmentAllocation.GetTWEligibility,
        {params: {serviceCenterId}}
    );
    dispatch(getTimeWindows(data));
}
export const setTimeWindows = (data: ITimeWindowEl): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.AppointmentAllocation.SetTWEligibility, {data}
    );
    await dispatch(loadTimeWindows(data.serviceCenterId));
}
export const getSrList = createAction<IAssignedServiceRequest[]>("PricingSettings/GetSRList");
export const loadSrList = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IAssignedServiceRequest>>(
        Api.endpoints.ServiceRequests.GetAssignedOverrides,
        {params: {pageSize: 0, serviceCenterId}}
    );
    dispatch(getSrList(result));
}
export const setEligibleRequest = (id: number, isEligibility: boolean, serviceCenterId?: number): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.ServiceRequests.Eligibility,
        {data: {id, isEligibility}}
    );
    if (serviceCenterId) {
        await dispatch(loadSrList(serviceCenterId));
    }
}
export const getPricingCalculations = createAction<IPricingSetting[]>("PricingSettings/GetCalculations");
export const loadPricingCalculations = (serviceRequestId: number, timeOfYearCategory?: EDemandCategory): AppThunk => async dispatch => {
    const {data} = await Api.call<IPricingSetting[]>(
        Api.endpoints.PricingSettings.Calculation,
        { params: {serviceRequestId, timeOfYearCategory} }
    );
    dispatch(getPricingCalculations(data));
}
export const getPricingDemand = createAction<IPricingDemand[]>("PricingSettings/GetDemands");
export const loadPricingDemand = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IPricingDemand[]>(
        Api.endpoints.PricingSettings.GetList,
        {params: {serviceCenterId}}
    );
    dispatch(getPricingDemand(data));
}
export const setPricingDemand = (data: IPricingDemand): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.PricingSettings.Edit,
        {data}
    )
    dispatch(loadPricingDemand(data.serviceCenterId));
}
export const getDayOfWeekPricing = createAction<IDayOfWeekSetting[]>("PricingSettings/GetDayOfWeek");
export const loadDayOfWeekPricing = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IDayOfWeekSetting[]>(
        Api.endpoints.PricingSettings.GetDayOfWeek,
        {params: {serviceCenterId}}
    );
    dispatch(getDayOfWeekPricing(data));
}
export const setWorkWeekPricing = (data: IDayOfWeekSetting[]): AppThunk => async () => {
    await Api.call(
        Api.endpoints.PricingSettings.SetDayOfWeek,
        {data: {serviceCenterId: data[0].serviceCenterId, items: data}}
    );
}
export const getTimeOfYearPricing = createAction<ITimeOfYearSetting[]>("PricingSettings/GetTimeOfYear");
export const loadTimeOfYearPricing = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data} = await Api.call<ITimeOfYearSetting[]>(
        Api.endpoints.PricingSettings.GetTimeOfYear,
        {
            params: {
                serviceCenterId,
                from: moment.utc().startOf("year").hour(0).minute(0).second(0).millisecond(0).toISOString(),
                to: moment.utc().endOf("year").hour(0).minute(0).second(0).millisecond(0).toISOString()
            }
        }
    );
    dispatch(getTimeOfYearPricing(data));
}
export const setTimeOfYearPricing = (data: ITimeOfYearSetting): AppThunk => async dispatch => {
    if (data?.id) {
        await Api.call(
            Api.endpoints.PricingSettings.UpdateTimeOfYear,
            {data, urlParams: {id: data.id}}
        );
    } else {
        await Api.call(
            Api.endpoints.PricingSettings.CreateTimeOfYear,
            {data}
        );
    }
    await dispatch(loadTimeOfYearPricing(data.serviceCenterId));
}

export const getRequestsPricingLevels = createAction<IRequestPricingSettings[]>("PrisingSettings/GetSRPricingLevels");
export const loadRequestsPricingLevels = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.PricingSettings.GetServiceRequestsPricingLevels, {params: {serviceCenterId}})
        .then(result => {
            if (result) {
                dispatch(getRequestsPricingLevels(result.data));
            }
        })
        .catch(err => {
            console.log('get service requests pricing levels error', err)
        })
        .finally(() => {
            dispatch(setLoading(false));
        })
}

export const updateSRPricingLevels = (serviceRequestId: number, data: Partial<IRequestPricingSettings>, callback = () => {}): AppThunk => dispatch => {
    Api.call(Api.endpoints.PricingSettings.ChangeServiceRequestPricingLevels, {urlParams: {id: serviceRequestId}, data })
        .then(result => {
            if (data.serviceCenterId && result) {
                dispatch(loadRequestsPricingLevels(data.serviceCenterId));
                callback();
            }
        })
        .catch(err => {
            console.log('update service request pricing level error', err)
        })
}

export const getSRPricingSettings = createAction<IRequestPricingSettings[]>("PricingSettings/GetSRPricingSettings");
export const loadSRPricingSettings = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.PricingSettings.GetServiceRequestsPricingSettings, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) {
                dispatch(getSRPricingSettings(result.data))
            }
        })
        .catch(err => {
            console.log('load service requests pricing settings error', err)
        })
        .finally(() => {
            dispatch(setLoading(false));
        })
}

export const updateSRPricingSettings = (serviceRequestId: number, data: Partial<IRequestPricingSettings>): AppThunk => dispatch => {
    Api.call(Api.endpoints.PricingSettings.UpdateServiceRequestPricingSettings, {urlParams: {id: serviceRequestId}, data})
        .then(result => {
            if (result && data.serviceCenterId) dispatch(loadSRPricingSettings(data.serviceCenterId))
        })
        .catch(err => {
            console.log('update service request pricing settings error', err)
        })
}

export const deleteSRPricingSettings = (id: number, serviceCenterId: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.PricingSettings.DeleteServiceRequestPricingSettings, {urlParams: {id}})
        .then(result => {
            if (result) dispatch(loadSRPricingSettings(serviceCenterId))
        })
        .catch(err => {
            console.log('delete service request pricing settings error', err)
        })
}


export const addServiceRequestsToPricing = (data: TNewRequestsToPricing): AppThunk => dispatch => {
    Api.call(Api.endpoints.PricingSettings.AddServiceRequests, {data})
        .then(result => {
            if (result) {
                dispatch(loadSRPricingSettings(data.serviceCenterId))
            }
        })
        .catch(err => {
            console.log('add service requests to pricing settings error', err)
        })
}

export const getMPList = createAction<IPackageShort[]>("PricingSettings/GetMPList");
export const loadMPList = (data: IGetMPListData): AppThunk => dispatch => {
    dispatch(setLoading);
    Api.call(Api.endpoints.MaintenancePackages.GetShortByQuery, {data})
        .then(res => {
            if (res?.data?.result) {
                dispatch(getMPList(res.data.result))
            }
        })
        .catch(err => {
            console.log('load maintenance packages eligibility list error', err);
        })
        .finally(() => dispatch(setLoading(false)));
}

export const setPricingOptimization = (id: number, isApplyPricingOptimization: boolean, data: IGetMPListData): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.SetPricingOptimization, {urlParams: {id}, data: {isApplyPricingOptimization}})
        .then(result => {
            if (result) {
                dispatch(loadMPList(data));
            }
        })
        .catch(err => {
            console.log('set pricing optimization for package error', err)
        })
        .finally(() => dispatch(setLoading(false)));
}
export const getRoundPriceSetting = createAction<boolean>('PricingSettings/GetRoundPriceSetting');
export const setRoundPriceLoading = createAction<boolean>('PricingSettings/SetRoundPriceLoading');

export const loadRoundPriceSetting = (id: number): AppThunk => dispatch => {
    dispatch(setRoundPriceLoading(true))
    Api.call(Api.endpoints.ServiceCenters.GetRoundPrice, {urlParams: {id}})
        .then(result => {
            dispatch(getRoundPriceSetting(result.data))
        })
        .catch(err => {
            console.log('set round price setting error', err)
        })
        .finally(() => dispatch(setRoundPriceLoading(false)))
}

export const changeRoundPriceSetting = (id: number, isRoundPrice: boolean): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCenters.ChangeRoundPrice, {urlParams: {id}, data: {isRoundPrice}})
        .then(result => {
            if (result) dispatch(loadRoundPriceSetting(id))
        })
        .catch(err => {
            console.log('change round price setting error', err)
        })
}

export const getPackagePricingLevels = createAction<IPackagePricingLevels[]>('PricingSettings/GetPackagePricingSettings');
export const loadPackagePricingLevels = (serviceCenterId: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.PricingSettings.GetPackagePricingSettings, {params: {serviceCenterId}})
        .then(result => {
            if (result) dispatch(getPackagePricingLevels(result.data));
            }
        )
        .catch(err => {
            console.log('get package pricing setting error', err)
        })
}

export const updateMPPricingLevels = (serviceRequestId: number, data: Partial<IPackagePricingLevels>, callback = () => {}): AppThunk => dispatch => {
    Api.call(Api.endpoints.PricingSettings.ChangePackagePricingSettings, {urlParams: {id: serviceRequestId}, data })
        .then(result => {
            if (data.serviceCenterId && result) {
                dispatch(loadPackagePricingLevels(data.serviceCenterId));
                callback();
            }
        })
        .catch(err => {
            console.log('update package pricing level error', err)
        })
}

export const getMPPricingSettings = createAction<IPackagePricingSettings[]>("PricingSettings/GetMPPricingSettings");
export const loadMPPricingSettings = (serviceCenterId: number): AppThunk => dispatch => {
    // dispatch(setLoading(true));
    // Api.call(Api.endpoints.PricingSettings.GetServiceRequestsPricingSettings, {params: {serviceCenterId}})
    //     .then(result => {
    //         if (result?.data) {
    //             dispatch(getMPPricingSettings(result.data))
    //         }
    //     })
    //     .catch(err => {
    //         console.log('load service requests pricing settings error', err)
    //     })
    //     .finally(() => {
    //         dispatch(setLoading(false));
    //     })
}

export const updatePackagePricingSettings = (maintenancePackageId: number, data: Partial<IPackagePricingSettings>): AppThunk => dispatch => {
    // Api.call(Api.endpoints.PricingSettings.UpdateServiceRequestPricingSettings, {urlParams: {id: maintenancePackageId}, data})
    //     .then(result => {
    //         if (result && data.serviceCenterId) dispatch(loadMPPricingSettings(data.serviceCenterId))
    //     })
    //     .catch(err => {
    //         console.log('update package pricing settings error', err)
    //     })
}

export const deletePackagePricingSettings = (id: number, serviceCenterId: number): AppThunk => dispatch => {
    // Api.call(Api.endpoints.PricingSettings.DeleteServiceRequestPricingSettings, {urlParams: {id}})
    //     .then(result => {
    //         if (result) dispatch(loadMPPricingSettings(serviceCenterId))
    //     })
    //     .catch(err => {
    //         console.log('delete service request pricing settings error', err)
    //     })
}

