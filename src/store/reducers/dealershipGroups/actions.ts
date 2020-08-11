import {DealershipActions, IDealershipGroup, IDealershipGroupForm} from "./types";
import {ThunkAction} from "redux-thunk";
import {ActionCreator, Dispatch} from "redux";
import {dealershipGroupsMock} from "./mock";
import {PromiseTimeout} from "../../../utils/utils";
import {Api} from "../../../config/requests";

export const loading = (payload: boolean): DealershipActions => ({
    type: "Dealership/Loading", payload
});

export const saving = (payload: boolean): DealershipActions => ({
    type: "Dealership/Saving", payload
})

const getAll = (payload: IDealershipGroup[]): DealershipActions => ({
    type: "Dealership/GetAll", payload
});

const add = (payload: IDealershipGroup): DealershipActions => ({
    type: "Dealership/Add", payload
});

export const loadAll: ActionCreator<ThunkAction<
  Promise<DealershipActions>,
  IDealershipGroup,
  null,
  DealershipActions
>> = () => {
  return async (dispatch: Dispatch) => {
    dispatch(loading(true));
    const dealerships: IDealershipGroup[] = await PromiseTimeout<IDealershipGroup[]>(dealershipGroupsMock, 1000);
    dispatch(loading(false));
    return dispatch(getAll(dealerships));
  };
};

export const create = (data: IDealershipGroupForm) => async (dispatch: Dispatch) => {
    dispatch(saving(true));

    try {
        const {data: rData} = await Api.call<IDealershipGroup>(Api.endpoints.Dealerships.Create, {data});
        dispatch(saving(false));
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }

    // const createdData: IDealershipForm = await PromiseTimeout<IDealershipForm>(data, 500);
    // dispatch(saving(false));
    //
    // const fixedData: IDealershipGroup = {
    //     ...createdData, serviceCenters: createdData.serviceCenters || 0, employees: createdData.employees || 0
    // }
    // return dispatch(add(fixedData));
}