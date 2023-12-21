import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export type THOOForm = {
    dayOfWeek: number;
    from: ParsableDate;
    to: ParsableDate;
    checked: boolean
};