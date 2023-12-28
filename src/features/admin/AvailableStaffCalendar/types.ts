import {Moment} from "moment/moment";

export enum Directions {
    Next, Prev
}

export type TDayType = "prev" | "cur" | "next"

export type TDay = {
    date: Moment,
    day: number,
    type: TDayType
}