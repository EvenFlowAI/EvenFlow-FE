import {IOrder} from "../types/types";

export const APIHost = process.env.REACT_APP_ENV === "stage"
    ? "https://be.stage.evenflow.ai"
    : "http://3.129.173.158:8008";
export const APIUrl = `${APIHost}/api/v0`;

export const defaultRowsPerPageOptions = [10, 50, 100];
export const defaultRowsPerPage = 10;
export const defaultOrder: IOrder = {isAscending: true};
export const superUser = "Super Admin";