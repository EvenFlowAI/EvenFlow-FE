import moment from "moment/moment";

export type TForm = {
    timeStart: moment.Moment|null;
    timeEnd: moment.Moment|null;
    podId?: number;
}