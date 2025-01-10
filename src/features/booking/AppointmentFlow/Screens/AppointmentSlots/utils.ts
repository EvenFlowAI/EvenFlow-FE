import { IRemappedAppointmentSlot } from "../../../../../store/reducers/appointment/types";
import { TGroupedAppointments } from "../../../../../utils/types";
import { TParsableDate } from "../../../../../types/types";
import dayjs from "dayjs";

export const getAppointmentDate = (date: TParsableDate, d: number) => {
  return dayjs
    .utc(date)
    .date(d)
    .startOf("day")
    .toISOString()
    .replace(".000", "");
};
export const groupAppointments = (
  slots: IRemappedAppointmentSlot[],
): TGroupedAppointments => {
  const appointments: TGroupedAppointments = {};
  for (let slot of slots) {
    const date = dayjs(slot.date);
    const idx = slot.id.split("|")[0];
    if (appointments[idx]) {
      appointments[idx].appointments.push(slot);
      if (slot.offer) {
        appointments[idx].offers =
          appointments[idx].offers || Boolean(slot.offer);
      }
      if (
        (slot.priceWithOffer?.value || slot.price.value) <
        appointments[idx].lowestPrice
      ) {
        appointments[idx].lowestPrice =
          slot.priceWithOffer?.value || slot.price.value;
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
};
