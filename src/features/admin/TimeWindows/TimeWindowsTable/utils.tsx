import {ITimeWindow} from "../../../../store/reducers/demandSegments/types";
import {TForm} from "./types";

export const getData = (d: ITimeWindow): TForm => {
    return {
        start: d.startInHours,
        stop: d.startInHours + d.durationInHours,
        duration1: d.startInHours,
        duration2: d.durationInHours
    };
}