import {TArgCallback} from "../../../../types/types";
import moment from "moment/moment";

export type TMonthProps = {
    date: moment.Moment,
    loading: boolean;
    onDateChange: TArgCallback<moment.Moment>;
}

export type TSlot = {
    date: moment.Moment;
    label: string;
}