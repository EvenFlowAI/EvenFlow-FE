import {createAction} from "@reduxjs/toolkit";
import {TReassignZip, TZipCode, TZone, TZoneNew, TZoneUpdate} from "../mobileService/types";
import {AppThunk} from "../../../types/types";
import {
    IDistancePriceSettings,
    IZonePriceSettings,
    IZonePricingUpdate,
    TDistanceRange,
    TDistanceRangeUpdate
} from "./types";
import {EServiceType} from "../appointmentFrameReducer/types";
import {Api} from "../../../config/requests";

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
                dispatch(loadServiceValetZones(serviceCenterId))
                onSuccess();
            }
        })
        .catch(err => {
            console.log('remove service valet zone error', err)
            dispatch(setLoading(false))
            onError(err);
        })
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
    dispatch(setLoading(true));
    const data = {
        pageIndex: 0,
        pageSize: 0,
        serviceType: EServiceType.PikUpDropOff,
        serviceCenterId: id
    }
    Api.call(Api.endpoints.AncillaryPricing.GetZones, {data})
        .then(result => {
            if (result?.data?.result) dispatch(setServiceValetPrisingByZones(result.data.result))
        })
        .catch(err => {
            console.log('get ancillary pricing by geographic zones for Service Valet error', err)
        })
        .finally(() => {
            dispatch(setLoading(false));
        })
}

export const loadServiceValetPrisingByDistance = (id: number): AppThunk => dispatch => {
    dispatch(setLoading(true));
    const data = {
        pageIndex: 0,
        pageSize: 0,
        serviceCenterId: id,
        serviceType: EServiceType.PikUpDropOff,
    }
    Api.call(Api.endpoints.AncillaryPricing.GetDistances, {data})
        .then(({data}) => {
            if (data?.result) dispatch(setServiceValetPrisingByDistance(data.result))
        })
        .catch(err => {
            console.log('get distances for service valet error', err)
        })
        .finally(() => dispatch(setLoading(false)));
}

export const updateServiceValetPrisingByZones =  (serviceCenterId: number, id: number, data: IZonePricingUpdate): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.UpdateZone, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadServiceValetPrisingByZones(serviceCenterId));
            }
        })
        .catch(err => {
            console.log('update ancillary pricing by zone for service valet error', err)
        })
        .finally(() => dispatch(setLoading(false)));
}

export const updateServiceValetPrisingByDistance = (serviceCenterId: number, id: number, data: TDistanceRangeUpdate, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.UpdateDistance, {urlParams: {id}, data})
        .then(result => {
            if (result) dispatch(loadServiceValetPrisingByDistance(serviceCenterId))
        })
        .catch(err => {
            dispatch(setLoading(false))
            onError(err)
            console.log('update service valet pricing by distance error', err)
        })
}

export const deleteServiceValetPrisingByDistance = (id: number, pricingId: number, onError: (err:string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.DeleteDistance, {urlParams: {id: pricingId}})
        .then(result => {
            if (result) dispatch(loadServiceValetPrisingByDistance(id))
        })
        .catch(err => {
            console.log('delete pricing by distance for service valet error', err)
            onError(err)
            dispatch(setLoading(false))
        })
}

export const addServiceValetDistanceRange = (id: number, data: TDistanceRange, onSuccess: () => void, onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.AncillaryPricing.CreateDistance, {data})
        .then(result => {
            if (result) {
                onSuccess();
                dispatch(loadServiceValetPrisingByDistance(id))
            }
        })
        .catch(err => {
            onError(err)
            console.log('create service valet distance range error', err)
            dispatch(setLoading(false))
        })
}

export const loadServiceValetPricingOption = (id: number): AppThunk => dispatch => {
    // todo request
}

export const changeServiceValetPriceSettings = (id: number, countByZone: boolean): AppThunk => dispatch => {
    // todo request
}