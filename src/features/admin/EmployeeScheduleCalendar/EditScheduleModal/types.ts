import {Dayjs} from "dayjs";

export type TForm = {
    timeStart: Dayjs|null;
    timeEnd: Dayjs|null;
    podId?: number;
}