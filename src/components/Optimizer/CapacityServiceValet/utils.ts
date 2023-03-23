import {ETimeWindows, EZoneTimeGap, IZoneTimeSlot} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {TZone} from "../../../store/reducers/mobileService/types";

export const generateTimeSlots = (gap: EZoneTimeGap, startHour?: string|undefined, endHour?: string|undefined): moment.Moment[] => {
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
    return slots;
}

export const generateZoneSlots = (gap: EZoneTimeGap, zoneTimeWindows: IZoneTimeSlot[], zones: TZone[], startHour?: string|undefined, endHour?: string|undefined): IZoneTimeSlot[] => {
    const slots: moment.Moment[] = generateTimeSlots(gap, startHour, endHour);
    const data: IZoneTimeSlot[] = [];

    slots.forEach(item => {
        const window = zoneTimeWindows.find(el => moment(el.start).format('HH:mm a') === moment(item).format('HH:mm a'))
        data.push(window ?? {
            id: 0,
            zones: zones.map(zone => ({zoneId: zone.id, zoneName: zone.name, timeSlotType: gap, timeWindow: ETimeWindows.NotAvailable})),
            start: item.toISOString(),
        })
    })

    return data;
}