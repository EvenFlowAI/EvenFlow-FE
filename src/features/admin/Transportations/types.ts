import moment from "moment/moment";

export type TTimeObject = {
    start?: string | moment.Moment;
    end?: string | moment.Moment;
}

export type TOption = {
    value: number;
    name: string;
}