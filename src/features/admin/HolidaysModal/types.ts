import {ParsableDate} from "../../../types/types";

export type THolidayForm = {
    date: ParsableDate;
    isRecurring: boolean;
    description: string;
};