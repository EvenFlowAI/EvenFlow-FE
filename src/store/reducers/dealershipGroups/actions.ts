import {DealershipActions, IDealershipGroupExtended, IDealershipGroupForm} from "./types";
import {ThunkAction} from "redux-thunk";
import {ActionCreator, Dispatch} from "redux";
import {Api} from "../../../config/requests";
import {PaginatedAPIResponse} from "../../../types/types";

export const loading = (payload: boolean): DealershipActions => ({
    type: "Dealership/Loading", payload
});

export const saving = (payload: boolean): DealershipActions => ({
    type: "Dealership/Saving", payload
})

const getAll = (payload: IDealershipGroupExtended[]): DealershipActions => ({
    type: "Dealership/GetAll", payload
});

// const add = (payload: IDealershipGroup): DealershipActions => ({
//     type: "Dealership/Add", payload
// });

export const loadAll: ActionCreator<ThunkAction<Promise<DealershipActions>,
    IDealershipGroupExtended,
    null,
    DealershipActions>> = () => {
    return async (dispatch: Dispatch) => {
        dispatch(loading(true));
        try {
            const {data: {result: dealerships}} = await Api.call<
                PaginatedAPIResponse<IDealershipGroupExtended>
            >(Api.endpoints.Dealerships.GetAll, {data: {pageSize: 10}});
            dispatch(loading(false));
            return dispatch(getAll(dealerships));
        } catch (e) {
            dispatch(loading(false));
            throw e;
        }
    };
};

export const create: ActionCreator<ThunkAction<Promise<DealershipActions>,
    IDealershipGroupExtended,
    null,
    DealershipActions>> = (data: IDealershipGroupForm) => async (dispatch) => {
    dispatch(saving(true));

    try {
        await Api.call<number>(Api.endpoints.Dealerships.Create, {data});
        // TODO: Talk about full object response not id
        // const {data: rData} = await Api.call<number>(Api.endpoints.Dealerships.Create, {data});
        dispatch(saving(false));
        return dispatch(loadAll());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}