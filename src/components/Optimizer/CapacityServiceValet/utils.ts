import {ETimeWindows, EZoneTimeGap, IZoneTimeWindow} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {TZone} from "../../../store/reducers/mobileService/types";

export const generateZoneSlots = (gap: EZoneTimeGap, zoneTimeWindows: IZoneTimeWindow[], zones: TZone[], startHour?: string|undefined, endHour?: string|undefined): IZoneTimeWindow[] => {
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

    const data: IZoneTimeWindow[] = [];
    zones.forEach(zone => {
       slots.forEach(item => {
            const window = zoneTimeWindows.find(el => moment(el.start).format('HH:mm A') === moment(item).format('HH:mm A') && zone.id === el.zoneId)
            data.push(window ?? {
                id: 0,
                zoneId: zone.id,
                zoneName: zone.name,
                timeSlotType: gap,
                timeWindow: ETimeWindows.NotAvailable,
                start: item.toISOString(),
            })
        });
    })

    return data;
}