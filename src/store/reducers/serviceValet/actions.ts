import {createAction} from "@reduxjs/toolkit";
import {TZone, TZoneNew} from "../mobileService/types";
import {AppThunk} from "../../../types/types";
import {IDistancePriceSettings, IZonePriceSettings, TDistanceRange} from "./types";
import {EServiceType} from "../appointmentFrameReducer/types";
import {Api} from "../../../config/requests";

export const setCurrentZone = createAction<any>('ServiceValet/SetCurrentZone');
export const setLoading = createAction<boolean>('ServiceValet/SetLoading');
export const setZones = createAction<TZone[]>('ServiceValet/SetZones');
export const setServiceValetPrisingByZones = createAction<IZonePriceSettings[]>('ServiceValet/SetPrisingSettingsByZones');
export const setServiceValetPrisingByDistance = createAction<IDistancePriceSettings[]>('ServiceValet/SetPrisingSettingsByDistance');
export const setServiceValetPrisingOption = createAction<boolean>('ServiceValet/SetServiceValetPrisingOption');
export const setPricingOptionLoading = createAction<boolean>('ServiceValet/SetPricingOptionLoading');

export const loadServiceValetZones = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    const data = {
        pageIndex: 0,
        pageSize: 0,
        serviceType: EServiceType.PikUpDropOff,
        serviceCenterId: id
    }
    Api.call(Api.endpoints.GeographicZones.GetZones, {data})
        .then(result => {
            if (result) dispatch(setZones(result.data))
        })
        .catch(err => {
            console.log('get geographic zones for service valet error', err)
        })
        .finally(() => dispatch(setLoading(false)))

}

export const addServiceValetZone = (id: number, data: TZoneNew): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Create, {data: {...data, serviceType: EServiceType.PikUpDropOff}})
        .then(result => {
            if (result) dispatch(loadServiceValetZones(data.serviceCenterId))
        })
        .catch(err => {
            console.log('add service valet zone error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const removeServiceValetZone = (id: number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
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

export const updateServiceValetZone = (id: number, zoneId: number, data: TZone): AppThunk => dispatch => {
// todo request
}

export const removeZipFromServiceValetZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    console.log('removed zip', zip);
// todo request
}

export const assignZipToServiceValetZone = (id: number, zoneId: number, zip: string): AppThunk => dispatch => {
    // todo request
}

export const saveLinkToServiceValetMap = (id: number, link: string): AppThunk => dispatch => {
    // todo request
}

export const loadServiceValetPrisingByZones = (id: number): AppThunk => dispatch => {
    // todo request
}

export const loadServiceValetPrisingByDistance = (id: number): AppThunk => dispatch => {
    // todo request
}

export const updateServiceValetPrisingByZones = (id: number, data: IZonePriceSettings): AppThunk => dispatch => {
    // todo request
}

export const updateServiceValetPrisingByDistance = (id: number, data: IDistancePriceSettings): AppThunk => dispatch => {
    // todo request
}

export const deleteServiceValetPrisingByZones = (id: number, pricingId: number): AppThunk => dispatch => {
    // todo request
}

export const deleteServiceValetPrisingByDistance = (id: number, pricingId: number): AppThunk => dispatch => {
    // todo request
}

export const addServiceValetDistanceRange = (id: number, range: TDistanceRange): AppThunk => dispatch => {
    // todo request
}

export const loadServiceValetPricingOption = (id: number): AppThunk => dispatch => {
    // todo request
}

export const changeServiceValetPriceSettings = (id: number, countByZone: boolean): AppThunk => dispatch => {
    // todo request
}