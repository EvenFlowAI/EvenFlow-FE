import { TChangePageDataGeneric, TChangePagingGeneric } from "../types";
import {
  IPageRequest,
  IPagingResponse,
  TParsableDate,
} from "../../../types/types";

export interface IHoliday {
  id?: number;
  date: TParsableDate;
  isRecurring: boolean;
  description: string;
  serviceCenterId: number;
}

export type TLoading = { type: "Holidays/Loading"; payload: boolean };
export type TSaving = { type: "Holidays/Saving"; payload: boolean };
export type TLoadAll = { type: "Holidays/LoadAll"; payload: IHoliday[] };
export type TPaging = TChangePagingGeneric<"Holidays/ChangePaging">;
export type TPageData = TChangePageDataGeneric<"Holidays/ChangePageData">;
export type THolidayActions =
  | TLoading
  | TSaving
  | TLoadAll
  | TPaging
  | TPageData;
export type TState = {
  holidaysList: IHoliday[];
  paging: IPagingResponse;
  pageData: IPageRequest;
  loading: boolean;
  saving: boolean;
  weeklyHolidaysList: IHoliday[];
};
