import {createAction} from "@reduxjs/toolkit";
import {
    EAncillaryPriceType,
    TAncillaryPriceTypeData, TChangeAncillaryPriceType,
    TReassignZip,
    TZipCode,
    TZone,
    TZoneNew,
    TZoneUpdate
} from "./types";
import {AppThunk} from "../../../types/types";
import {
    IDistancePriceSettings,
    IZonePriceSettings,
    IZonePricingUpdate,
    TDistanceRange,
    TDistanceRangeUpdate
} from "../serviceValet/types";
import {EServiceType} from "../appointmentFrameReducer/types";
import {Api} from "../../../config/requests";

export const setCurrentZone = createAction<TZone|null>('MobileService/SetCurrentZone');
export const setLoading = createAction<boolean>('MobileService/SetLoading');
export const setZones = createAction<TZone[]>('MobileService/SetZones');
export const setMobileServicePrisingByZones = createAction<IZonePriceSettings[]>('MobileService/SetPrisingSettingsByZones');
export const setMobileServicePrisingByDistance = createAction<IDistancePriceSettings[]>('MobileService/SetPrisingSettingsByDistance');
export const setMobileServicePrisingOption = createAction<EAncillaryPriceType>('MobileService/SetMobileServicePrisingOption');
export const setPricingOptionLoading = createAction<boolean>('MobileService/SetPricingOptionLoading');

export const loadMobServiceZones = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    const data = {
        pageIndex: 0,
        pageSize: 0,
        serviceType: EServiceType.MobileService,
        serviceCenterId: id
    }
    Api.call(Api.endpoints.GeographicZones.GetZones, {data})
        .then(result => {
            if (result?.data?.result) dispatch(setZones(result.data.result))
        })
        .catch(err => {
            console.log('get geographic zones for mobile service error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const getMobileZoneById = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.GetById, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(setCurrentZone(result.data))
            }
        })
        .catch(err => {
            console.log('get geographic zone by id error', err)
        })
        .finally(() => dispatch(setLoading(false)));
}

export const addMobServiceZone = (id: number, data: TZoneNew, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Create, {data: {...data, serviceType: EServiceType.MobileService}})
        .then(result => {
            if (result) {
                dispatch(loadMobServiceZones(data.serviceCenterId))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('add mobile zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
}

export const removeMobServiceZone = (id: number, serviceCenterId: number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Remove, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(loadMobServiceZones(serviceCenterId))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('remove mobile service zone error', err)
            dispatch(setLoading(false))
            onError(err);
        })
}

export const updateMobServiceZone = (id: number, serviceCenterId: number, data: TZoneUpdate, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadMobServiceZones(serviceCenterId))
                dispatch(getMobileZoneById(id));
                onSuccess();
            }
        })
        .catch(err => {
            console.log('update mobile service zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
}

export const removeZipFromMobServiceZone = (id: number, zip: TZipCode): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.RemoveZipCode, {urlParams: {id: zip.id}})
        .then(result => {
            if (result) dispatch(loadMobServiceZones(id))
        })
        .catch(err => {
            console.log('remove zip code from the mobile service zone error', err)
        })
        .finally(() => setLoading(false))
}

export const assignZipToMobServiceZone = (id: number, serviceCenterId: number, data: TReassignZip, prevZoneId: number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.ReassignZipCode, {urlParams: {id: data.id}, data})
        .then(result => {
            if (result) {
                dispatch(loadMobServiceZones(serviceCenterId))
                dispatch(getMobileZoneById(prevZoneId));
                onSuccess();
            }
        })
        .catch(err => {
            console.log('reassign zip code to the mobile service zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadMobileServicePrisingByZones = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    const data = {
        pageIndex: 0,
        pageSize: 0,
        serviceType: EServiceType.MobileService,
        serviceCenterId: id
    }
    Api.call(Api.endpoints.AncillaryPricing.GetZones, {data})
        .then(result => {
            if (result?.data?.result) dispatch(setMobileServicePrisingByZones(result.data.result))
        })
        .catch(err => {
            console.log('get ancillary pricing by geographic zones for Mobile Service error', err)
        })
        .finally(() => {
            dispatch(setLoading(false));
        })
}

export const loadMobileServicePrisingByDistance = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    const data = {
        pageIndex: 0,
        pageSize: 0,
        serviceCenterId: id,
        serviceType: EServiceType.MobileService,
    }
    Api.call(Api.endpoints.AncillaryPricing.GetDistances, {data})
        .then(({data}) => {
            if (data?.result) dispatch(setMobileServicePrisingByDistance(data.result))
        })
        .catch(err => {
            console.log('get distances for mobile service error', err)
        })
        .finally(() => dispatch(setLoading(false)));
}

export const updateMobileServicePrisingByZones = (serviceCenterId: number, id: number, data: IZonePricingUpdate, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.UpdateZone, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadMobileServicePrisingByZones(serviceCenterId));
            }
        })
        .catch(err => {
            onError(err);
            console.log('update ancillary pricing by zone for mobile service error', err)
        })
        .finally(() => dispatch(setLoading(false)));
}

export const updateMobileServicePrisingByDistance = (serviceCenterId: number, id: number, data: TDistanceRangeUpdate, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.UpdateDistance, {urlParams: {id}, data})
        .then(result => {
            if (result) dispatch(loadMobileServicePrisingByDistance(serviceCenterId))
        })
        .catch(err => {
            dispatch(setLoading(false))
            onError(err)
            console.log('update mobile service pricing by distance error', err)
        })
}

export const deleteMobileServicePrisingByDistance = (id: number, pricingId: number, onError: (err:string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.DeleteDistance, {urlParams: {id: pricingId}})
        .then(result => {
            if (result) dispatch(loadMobileServicePrisingByDistance(id))
        })
        .catch(err => {
            console.log('delete pricing by distance for mobile service error', err)
            onError(err)
            dispatch(setLoading(false))
        })
}

export const addMobileServiceDistanceRange = (id: number, data: TDistanceRange, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.CreateDistance, {data})
        .then(result => {
            if (result) {
                onSuccess();
                dispatch(loadMobileServicePrisingByDistance(id))
            }
        })
        .catch(err => {
            onError(err)
            console.log('create mobile service distance range error', err)
            dispatch(setLoading(false))
        })
}

export const loadMobileServicePricingOption = (id: number): AppThunk => dispatch => {
    dispatch(setPricingOptionLoading(true));
    const data: TAncillaryPriceTypeData = {
        serviceType: EServiceType.MobileService,
        serviceCenterId: id,
    }
    Api.call(Api.endpoints.ServiceCenters.GetAncillaryPriceType, {urlParams: {id}, data})
        .then(result => {
            if (result && Number.isInteger(result.data)) dispatch(setMobileServicePrisingOption(result.data))
        })
        .catch(err => {
            console.log('get ancillary pricing type error', err)
        })
        .finally(() => dispatch(setPricingOptionLoading(false)))
}

export const changeMobileServicePriceSettings = (id: number, ancillaryPriceType: EAncillaryPriceType, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setPricingOptionLoading(true))
    const data: TChangeAncillaryPriceType = {
        serviceType: EServiceType.MobileService,
        ancillaryPriceType,
    }
    Api.call(Api.endpoints.ServiceCenters.UpdateAncillaryPriceType, {urlParams: {id}, data})
        .then(result => {
            if (result) dispatch(loadMobileServicePricingOption(id))
        })
        .catch(err => {
            console.log('update ancillary pricing type error', err)
            onError(err);
            dispatch(setPricingOptionLoading(false));
        })
}

export const saveLinkToMobServiceMap = (id: number, link: string): AppThunk => dispatch => {
    // todo request
}
