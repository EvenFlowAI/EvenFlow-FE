import {ParsableDate} from "../../../types/types";

export type TBreak = {
    id?: number;
    from: ParsableDate;
    to: ParsableDate;
    checked: boolean;
    dayOfWeek: number;
}