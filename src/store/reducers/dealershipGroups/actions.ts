import {DealershipActions, IDealershipGroup} from "./types";
import {ThunkAction} from "redux-thunk";
import {ActionCreator, Dispatch} from "redux";
import {dealershipGroupsMock} from "./mock";
import {PromiseTimeout} from "../../../utils/utils";

export const loading = (payload: boolean): DealershipActions => ({
    type: "Dealership/Loading", payload
});

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

export const create = (data: IDealershipGroup) => async (dispatch: Dispatch) => {
    dispatch(loading(true));
    const createdData: IDealershipGroup = await PromiseTimeout<IDealershipGroup>(data, 500);
    dispatch(loading(false));
    return dispatch(add(createdData));
}