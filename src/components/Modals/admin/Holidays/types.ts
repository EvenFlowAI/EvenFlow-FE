import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export type THolidayForm = {
    date: ParsableDate;
    isRecurring: boolean;
    description: string;
};