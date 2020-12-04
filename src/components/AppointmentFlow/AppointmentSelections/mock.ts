import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import moment from "moment";

export enum EOfferType {
    Percentage, Amount, Free
}
export type TOffer = {
    type: EOfferType;
    value: number;
}
export type TAppointment = {
    id: number;
    date: ParsableDate;
    offer?: TOffer;
    shortWait: boolean;
    loanerCar: boolean;
    earlyDropOff: boolean;
}
const getOfferType = (): EOfferType => {
    const r = Math.random();
    return r >= .66 ? EOfferType.Free : r >= .33 ? EOfferType.Amount : EOfferType.Percentage;
}
export const generateOffer = (): TOffer => {
    return {
        type: getOfferType(),
        value: Math.floor(Math.random() * 22)
    }
}
export const randomBool = (): boolean => {
    return (Math.random() >= .5);
}
export const generateAppointment = (id: number, dt?: moment.Moment): TAppointment => {
    const dateModifier = Math.floor(Math.random() * 20);
    const hourModifier = Math.floor(Math.random() * 10);
    const minuteModifier = Math.floor(Math.random() * 10);
    const date = moment(dt)
        .add(dateModifier, "days")
        .add(hourModifier, "hours")
        .add(minuteModifier, "minutes")
        .toISOString()
    return {
        id,
        date,
        earlyDropOff: randomBool(),
        loanerCar: randomBool(),
        shortWait: randomBool(),
        offer: randomBool() ? generateOffer() : undefined
    }
}

export const getAppointmentList = (count:number=15, date:moment.Moment=moment()): TAppointment[] => {
    const appointmentList: TAppointment[] = [];
    for (let i = 1; i < count + 1; i++) {
        appointmentList.push(generateAppointment(i, date));
    }
    return appointmentList;
}