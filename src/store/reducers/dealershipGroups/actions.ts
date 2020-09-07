import {
    DealershipActions,
    IDealershipGroupExtended,
    IDealershipGroupForm,
    IDealershipProfile,
    IDealershipProfileForm
} from "./types";
import {ThunkAction} from "redux-thunk";
import {ActionCreator, Dispatch} from "redux";
import {Api} from "../../../config/requests";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {RootState} from "../../rootReducer";

export const loading = (payload: boolean): DealershipActions => ({
    type: "Dealership/Loading", payload
});

export const saving = (payload: boolean): DealershipActions => ({
    type: "Dealership/Saving", payload
})

const getAll = (payload: IDealershipGroupExtended[]): DealershipActions => ({
    type: "Dealership/GetAll", payload
});

const changePaging = (payload: IPagingResponse): DealershipActions => ({
    type: "Dealership/ChangePaging", payload
});

const _changePageData = (payload: Partial<IPageRequest>): DealershipActions => ({
    type: "Dealership/ChangePageData", payload
});

export const changePageData: ActionCreator<ThunkAction<
    void,
    RootState,
    void,
    DealershipActions
    >> = (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(_changePageData(payload));
        dispatch(loadAll());
    }
}

// const add = (payload: IDealershipGroup): DealershipActions => ({
//     type: "Dealership/Add", payload
// });

export const loadAll: ActionCreator<ThunkAction<
    void,
    RootState,
    void,
    DealershipActions>> = () => {
    return async (dispatch: Dispatch, getState) => {
        dispatch(loading(true));
        const state = getState();
        try {
            const {data: {result: dealerships, paging}} = await Api.call<
                PaginatedAPIResponse<IDealershipGroupExtended>
            >(Api.endpoints.Dealerships.GetAll, {data: state.dealershipGroups.pageData});
            dispatch(loading(false));
            dispatch(changePaging(paging));
            dispatch(getAll(dealerships));
        } catch (e) {
            dispatch(loading(false));
            throw e;
        }
    };
};

export const create: ActionCreator<ThunkAction<
    void,
    RootState,
    void,
    DealershipActions>> = (data: IDealershipGroupForm) => async (dispatch) => {
    dispatch(saving(true));

    try {
        await Api.call<number>(Api.endpoints.Dealerships.Create, {data});
        // TODO: Talk about full object response not id
        // const {data: rData} = await Api.call<number>(Api.endpoints.Dealerships.Create, {data});
        dispatch(saving(false));
        dispatch(loadAll());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}


const _remove = (payload: number): DealershipActions => ({
    type: "Dealership/Remove",
    payload
})
export const remove: ActionCreator<ThunkAction<
    void,
    RootState,
    void,
    DealershipActions>> = (id: number) => async dispatch => {
    try {
        await Api.call(Api.endpoints.Dealerships.Remove, {urlParams: {id}})
        dispatch(_remove(id));
    } catch (e) {
        throw e;
    }
}

const _loadDealershipProfile = (payload: IDealershipProfile): DealershipActions => ({type: "Dealership/Profile", payload});
export const loadDealershipProfile = (): AppThunk => async dispatch => {
    const {data} = await Api.call<IDealershipProfile>(Api.endpoints.Accounts.Dealership);
    dispatch(_loadDealershipProfile(data));
}

export const updateDealership = (payload: IDealershipProfileForm, id: number): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.Dealerships.Update,
        {urlParams: {id}, data: payload}
    );
    await dispatch(loadDealershipProfile());
}