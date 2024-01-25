import {THOOForm} from "./types";
import dayjs from "dayjs";

export const blankRow: THOOForm = {
    dayOfWeek: 0, from: null, to: null, checked: false
}
export const initialForm: THOOForm[] = dayjs.weekdays().map((w, idx) => {
    return {...blankRow, dayOfWeek: idx};
});