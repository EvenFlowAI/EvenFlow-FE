import {TComplimentary} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {loadComplimentary} from "../packages/actions";

export const addComplimentaryManually = (data: TComplimentary, callback: () => void, errCallback = (err: string) => {}): AppThunk => dispatch => {
    Api.call(Api.endpoints.ComplimentaryServices.Create, {data})
        .then(result => {
            if (result) {
                dispatch(loadComplimentary(data.serviceCenterId));
                callback();
            }
        })
        .catch(err => {
            errCallback(err)
            console.log('add complimentary manually error', err)
        })
}

export const editComplimentary = (id: number, data: TComplimentary, callback: () => void, errCallback = (err: string) => {}): AppThunk => dispatch => {
    Api.call(Api.endpoints.ComplimentaryServices.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadComplimentary(data.serviceCenterId));
                callback();
            }
        })
        .catch(err => {
            errCallback(err)
            console.log('edit complimentary manually error', err)
        })
}

export const addOpsCodeFromList = (serviceRequests: number[], serviceCenterId: number, errorCallback = (err: string) => {}): AppThunk => dispatch => {
    Api.call(Api.endpoints.ComplimentaryServices.AddFromList, {data: { serviceCenterId, serviceRequests }})
        .then(result => {
            if (result) {
                dispatch(loadComplimentary(serviceCenterId));
            }
        }).catch(err => {
        console.log('add ops code to complimentary error', err)
        errorCallback && errorCallback(err)
    })
}