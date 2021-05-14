import {TRole} from "../store/reducers/users/types";

export type TCalendarProps = {
    text: string;
    dates: string[];
    location: string;
    timeZone?: string;
    details?: string;
}
export type TRouteRoleMap = {
    route: string;
    roles: TRole[] | boolean;
}