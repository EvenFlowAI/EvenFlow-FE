import {createAction} from "@reduxjs/toolkit";
import {TZone, TZoneNew} from "./types";
import {AppThunk} from "../../../types/types";
import {IDistancePriceSettings, IZonePriceSettings, TDistanceRange} from "../serviceValet/types";
import {EServiceType} from "../appointmentFrameReducer/types";
import {Api} from "../../../config/requests";

export const setCurrentZone = createAction<any>('MobileService/SetCurrentZone');
export const setLoading = createAction<boolean>('MobileService/SetLoading');
export const setZones = createAction<TZone[]>('MobileService/SetZones');
export const setMobileServicePrisingByZones = createAction<IZonePriceSettings[]>('MobileService/SetPrisingSettingsByZones');
export const setMobileServicePrisingByDistance = createAction<IDistancePriceSettings[]>('MobileService/SetPrisingSettingsByDistance');
export const setMobileServicePrisingOption = createAction<boolean>('MobileService/SetMobileServicePrisingOption');
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
            if (result) dispatch(setZones(result.data))
        })
        .catch(err => {
            console.log('get geographic zones for mobile service error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const addMobServiceZone = (id: number, data: TZoneNew): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Create, {data: {...data, serviceType: EServiceType.MobileService}})
        .then(result => {
            if (result) dispatch(loadMobServiceZones(data.serviceCenterId))
        })
        .catch(err => {
            console.log('add mobile zone error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const removeMobServiceZone = (id: number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Remove, {urlParams: {id}})
        .then(result => {
            if (result) onSuccess();
        })
        .catch(err => {
            console.log('remove mobile service zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateMobServiceZone = (id: number, zoneId: number, data: TZone): AppThunk => dispatch => {
// todo request
}

export const removeZipFromMobServiceZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    console.log('removed zip', zip);
// todo request
}

export const assignZipToMobServiceZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    // todo request
}

export const saveLinkToMobServiceMap = (id: number, link: string): AppThunk => dispatch => {
    // todo request
}

export const loadMobileServicePrisingByZones = (id: number): AppThunk => dispatch => {
    // todo request
}

export const loadMobileServicePrisingByDistance = (id: number): AppThunk => dispatch => {
    // todo request
}

export const updateMobileServicePrisingByZones = (id: number, data: IZonePriceSettings): AppThunk => dispatch => {
    // todo request
}

export const updateMobileServicePrisingByDistance = (id: number, data: IDistancePriceSettings): AppThunk => dispatch => {
    // todo request
}

export const deleteMobileServicePrisingByZones = (id: number, pricingId: number): AppThunk => dispatch => {
    // todo request
}

export const deleteMobileServicePrisingByDistance = (id: number, pricingId: number): AppThunk => dispatch => {
    // todo request
}

export const addMobileServiceDistanceRange = (id: number, range: TDistanceRange): AppThunk => dispatch => {
    // todo request
}

export const loadMobileServicePricingOption = (id: number): AppThunk => dispatch => {
    // todo request
}

export const changeMobileServicePriceSettings = (id: number, countByZone: boolean): AppThunk => dispatch => {
    // todo request
}