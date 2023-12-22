import moment from "moment/moment";
import {IRemappedAppointmentSlot} from "../../../../store/reducers/appointment/types";
import {TGroupedAppointments} from "../../../../utils/types";

export const getAppointmentDate = (date: moment.Moment, d: number) => {
    return moment.utc(date).date(d).startOf('day').toISOString().replace('.000', '');
}
export const groupAppointments = (slots: IRemappedAppointmentSlot[]): TGroupedAppointments => {
    const appointments: TGroupedAppointments = {};
    for (let slot of slots) {
        const date = moment(slot.date);
        const idx = slot.id.split("|")[0];
        if (appointments[idx]) {
            appointments[idx].appointments.push(slot);
            if (slot.offer) {
                appointments[idx].offers = appointments[idx].offers || Boolean(slot.offer);
            }
            if ((slot.priceWithOffer?.value || slot.price.value) < appointments[idx].lowestPrice) {
                appointments[idx].lowestPrice = slot.priceWithOffer?.value || slot.price.value;
                appointments[idx].ancillaryPrice = slot.price.ancillaryPrice;
            }
        } else {
            const lowestPrice = slot.priceWithOffer?.value ?? slot.price.value;
            const amountOfSavingMoney = slot?.price?.amountOfSavingMoney;
            appointments[idx] = {
                date,
                idx,
                lowestPrice,
                appointments: [slot],
                offers: Boolean(slot.offer),
                amountOfSavingMoney: amountOfSavingMoney,
                ancillaryPrice: slot.price.ancillaryPrice,
            };
        }
    }
    return appointments;
}