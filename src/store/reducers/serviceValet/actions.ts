import {createAction} from "@reduxjs/toolkit";
import {TReassignZip, TZipCode, TZone, TZoneNew, TZoneUpdate} from "../mobileService/types";
import {AppThunk} from "../../../types/types";
import {IDistancePriceSettings, IZonePriceSettings, TDistanceRange} from "./types";
import {EServiceType} from "../appointmentFrameReducer/types";
import {Api} from "../../../config/requests";
import {loadMobServiceZones} from "../mobileService/actions";

export const setCurrentZone = createAction<TZone|null>('ServiceValet/SetCurrentZone');
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
            if (result?.data?.result) dispatch(setZones(result.data.result))
        })
        .catch(err => {
            console.log('get geographic zones for service valet error', err)
        })
        .finally(() => dispatch(setLoading(false)))

}

export const getServiceValetZoneById = (id: number): AppThunk => dispatch => {
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

export const addServiceValetZone = (id: number, data: TZoneNew, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Create, {data: {...data, serviceType: EServiceType.PikUpDropOff}})
        .then(result => {
            if (result) {
                dispatch(loadServiceValetZones(data.serviceCenterId))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('add service valet zone error', err)
            onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const removeServiceValetZone = (id: number, serviceCenterId: number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Remove, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(loadMobServiceZones(serviceCenterId))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('remove service valet zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
}

export const updateServiceValetZone = (id: number, serviceCenterId: number, data: TZoneUpdate, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadServiceValetZones(serviceCenterId))
                dispatch(getServiceValetZoneById(id))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('update service valet zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
}

export const removeZipFromServiceValetZone = (serviceCenterId: number, zip: TZipCode): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.RemoveZipCode, {urlParams: {id: zip.id}})
        .then(result => {
            if (result) dispatch(loadServiceValetZones(serviceCenterId))
        })
        .catch(err => {
            console.log('remove zip code from the service valet zone error', err)
        })
        .finally(() => setLoading(false))
}

export const reassignZipToServiceValetZone = (id: number, serviceCenterId: number, data: TReassignZip, prevZoneId:number, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.GeographicZones.ReassignZipCode, {urlParams: {id: data.id}, data})
        .then(result => {
            if (result) {
                dispatch(loadServiceValetZones(serviceCenterId))
                dispatch(getServiceValetZoneById(prevZoneId))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('reassign zip code to the service valet zone error', err)
            onError(err);
        })
        .finally(() => dispatch(setLoading(false)))
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