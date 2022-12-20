import {EZoneTimeGap} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";

export const generateZoneSlots = (gap: EZoneTimeGap, startHour?: string, endHour?: string): moment.Moment[] => {
    const slots: moment.Moment[] = [];
    if (!startHour) startHour = moment().set('hour', 7).set('minute', 0).toISOString()
    if (!startHour) endHour = moment().set('hour', 19).set('minute', 0).toISOString()

    let time: moment.Moment = moment(startHour);
    while (moment(time).diff(moment(endHour)) > 0) {
        slots.push(moment(time));
        time = moment(time).add(gap, 'minute');
    }
    return slots;
}