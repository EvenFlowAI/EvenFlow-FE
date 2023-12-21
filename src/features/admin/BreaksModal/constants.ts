import moment from "moment/moment";
import {TBreak} from "./types";

export const blankRow: TBreak = {
    checked: false, from: null, to: null, dayOfWeek: 0
};

export const initialBreaks: TBreak[] = moment.weekdays().map((day, dayOfWeek) => ({
    ...blankRow, dayOfWeek
}));