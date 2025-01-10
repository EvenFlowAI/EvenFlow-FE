import { TParsableDate } from "../../../types/types";

export enum Directions {
  Next,
  Prev,
}

export type TDayType = "prev" | "cur" | "next";

export type TDay = {
  date: TParsableDate;
  day: number;
  type: TDayType;
};
