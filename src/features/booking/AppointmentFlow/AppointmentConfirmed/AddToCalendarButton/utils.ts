import {TCalendarProps} from "../../../../../utils/types";
import queryString from 'query-string'

export const getCalendarUrl = (params: TCalendarProps): string => {
    const data: { [k: string]: string | undefined } = {...params, dates: params.dates.join("/")};
    data.action = "TEMPLATE";
    return `https://calendar.google.com/calendar/event?${queryString.stringify(data)}`;
}