import {IOrder} from "../types/types";
import {TRole} from "../store/reducers/users/types";

export const APIHost = process.env.REACT_APP_ENV === "stage"
    ? "https://be.stage.evenflow.ai"
    : "https://be.dev.evenflow.ai";
export const APIUrl = `${APIHost}/api/v0`;

export const defaultRowsPerPageOptions = [10, 50, 100];
export const defaultRowsPerPage = 10;
export const defaultOrder: IOrder = {isAscending: true};
export const superUser: TRole = "Super Admin";