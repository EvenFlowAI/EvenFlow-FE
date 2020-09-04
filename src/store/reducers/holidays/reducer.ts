import {IHoliday, THolidayActions} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";

type TState = {
    holidaysList: IHoliday[],
    paging: IPagingResponse,
    pageData: IPageRequest,
    loading: boolean,
    saving: boolean,
}
const initialState: TState = {
    holidaysList: [],
    loading: false,
    saving: false,
    paging: {...defaultPaging},
    pageData: {...defaultPageData}
};
export const holidaysReducer = (state=initialState, action: THolidayActions): TState => {
    switch (action.type) {
        case "Holidays/LoadAll":
            return {...state, holidaysList: action.payload};
        case "Holidays/ChangePageData":
            return {...state, pageData: {...state.pageData, ...action.payload}};
        case "Holidays/ChangePaging":
            return {...state, paging: action.payload};
        case "Holidays/Loading":
            return {...state, loading: action.payload};
        case "Holidays/Saving":
            return {...state, saving: action.payload};
        default:
            return state;
    }
}