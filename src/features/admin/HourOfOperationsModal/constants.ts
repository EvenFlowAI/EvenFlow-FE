import {THOOForm} from "./types";
import moment from "moment/moment";

export const blankRow: THOOForm = {
    dayOfWeek: 0, from: null, to: null, checked: false
}
export const initialForm: THOOForm[] = moment.weekdays().map((w, idx) => {
    return {...blankRow, dayOfWeek: idx};
});