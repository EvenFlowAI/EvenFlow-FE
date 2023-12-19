import {IOverbookingFactor} from "../../store/reducers/optimizationWindows/types";
import {EDay} from "../../store/reducers/demandSegments/types";

export const tableHead: string[] = [
    "Day", "No Show Rate (%)", "Day of Cancelations (%)", "Combined (%)", "Overbooking Factor"
];

export const initialDay = {} as IOverbookingFactor;

export const initialState = {
    [EDay.Sunday]: {...initialDay, day: EDay.Sunday},
    [EDay.Monday]: {...initialDay, day: EDay.Monday},
    [EDay.Tuesday]: {...initialDay, day: EDay.Tuesday},
    [EDay.Wednesday]: {...initialDay, day: EDay.Wednesday},
    [EDay.Thursday]: {...initialDay, day: EDay.Thursday},
    [EDay.Friday]: {...initialDay, day: EDay.Friday},
    [EDay.Saturday]: {...initialDay, day: EDay.Saturday},
}