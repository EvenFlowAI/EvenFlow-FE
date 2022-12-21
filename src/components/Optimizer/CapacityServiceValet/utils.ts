import {ETimeWindows, EZoneTimeGap, IZoneTimeWindow} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";

export const generateZoneSlots = (gap: EZoneTimeGap, zoneTimeWindows: IZoneTimeWindow[], startHour?: string|undefined, endHour?: string|undefined): IZoneTimeWindow[] => {
    const slots: moment.Moment[] = [];

    if (!startHour) {
        startHour = moment().set('hour', 7).set('minute', 0).toISOString()
    } else {
        const [hours, minutes] = startHour.split(':')
        startHour = moment().set('hour', +hours).set('minute', +minutes).toISOString()
    }
    if (!endHour) {
        endHour = moment().set('hour', 19).set('minute', 0).toISOString()
    } else {
        const [hours, minutes] = endHour.split(':')
        endHour = moment().set('hour', +hours).set('minute', +minutes).toISOString()
    }

    let time: moment.Moment = moment(startHour);
    while (moment(endHour).diff(moment(time)) > 0) {
        slots.push(moment(time));
        time = moment(time).add(gap, 'minute');
    }

    return slots.map(item => {
        const window = zoneTimeWindows.find(el => moment(el.start).format('HH:mm A') === moment(item).format('HH:mm A'))
        return window ?? {
            id: 0,
            zoneId: 0,
            zoneName: '',
            timeSlotType: gap,
            timeWindow: ETimeWindows.NotAvailable,
            start: item.toISOString(),
        }
    });
}