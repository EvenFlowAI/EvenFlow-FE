import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../utils";

export interface IHoliday {
    id?: number;
    date: ParsableDate;
    isRecurring: boolean;
    description: string;
    serviceCenterId: number;
}

export type TLoading = {type: "Holidays/Loading", payload: boolean};
export type TSaving = {type: "Holidays/Saving", payload: boolean};
export type TLoadAll = {type: "Holidays/LoadAll", payload: IHoliday[]};
export type TPaging = TChangePagingGeneric<"Holidays/ChangePaging">;
export type TPageData = TChangePageDataGeneric<"Holidays/ChangePageData">;
export type THolidayActions =
    | TLoading
    | TSaving
    | TLoadAll
    | TPaging
    | TPageData;