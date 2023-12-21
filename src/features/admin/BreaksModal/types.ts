import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export type TBreak = {
    id?: number;
    from: ParsableDate;
    to: ParsableDate;
    checked: boolean;
    dayOfWeek: number;
}