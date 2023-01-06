import {IAddress} from "../store/reducers/dealershipGroups/types";
import {ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction} from "react";
import {TCalendarProps, TGroupedAppointments, TGroupedAppointmentsList, TOption} from "./types";
import * as queryString from "querystring";
import {ICurrentUser} from "../store/reducers/users/types";
import {PERMISSIONS} from "../permissions";
import {matchPath} from "react-router-dom";
import {EAppointmentTimingType, IRemappedAppointmentSlot} from "../store/reducers/appointment/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {IAppointmentByQuery} from "../api/types";
import moment from "moment";
import {encode, decode} from 'url-safe-base64';

export function PromiseTimeout<T> (val: T, timeout=2000): Promise<T> {
    return new Promise(resolve => {
            setTimeout(() => resolve(val), timeout);
        }
    );
}

export const getInitials = (name?: string) => {
    if (!name) {
        return "-";
    }
    const data = name.split(' ').slice(0, 2);
    return data.filter(v => !!v).map(l => l[0].toUpperCase()).join('');
}

const defaultException = "Something went wrong";
export const getAPIException = (e: any): string => {
    return e ? e.response?.data?.message || e.message || defaultException : defaultException;
}

export const concatAddress = (address?: IAddress, def?: string): string => address
    ? `${address.street}, ${address.city}, ${address.zipCode}`
    : def || "";

export const pathReplace = (path: string, data?: Record<string, any>): string => {
    if (!data) return path;
    const keys = Object.keys(data).map(k => `{${k}}`);
    const re = new RegExp(keys.join('|'), "gi");
    return path.replace(re, matched => data[matched.slice(1, -1)] as string)
}
export const noop = () => {};

export const baseChangeHandler = <State>(setForm: Dispatch<SetStateAction<State>>): ChangeEventHandler<HTMLInputElement> => e => {
    setForm(form => ({...form, [e.target.name]: e.target.value}));
}
export const baseCheckHandler = <State>(setForm: Dispatch<SetStateAction<State>>) => (e: ChangeEvent<HTMLInputElement>): void => {
    setForm(form => ({...form, [e.target.name]: e.target.checked}));
}
export const baseSwitchHandler = <State>(setForm: Dispatch<SetStateAction<State>>) => (e: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setForm(form => ({...form, [e.target.name]: checked}));
}

export const getCalendarUrl = (params: TCalendarProps): string => {
    const data: {[k: string]: string|undefined} = {...params, dates: params.dates.join("/")};
    data.action = "TEMPLATE";
    return `https://calendar.google.com/calendar/event?${queryString.stringify(data)}`;
}
export const hasPermission = (user: ICurrentUser|undefined, route: string): boolean => {
    if (!user) {
        return true;
    }
    for (let row of PERMISSIONS) {
        if (matchPath(route, row.route)) {
            if (typeof row.roles === "boolean") {
                return row.roles;
            }
            return row.roles.includes(user.role);
        }
    }
    return true;
}

export const preCenterNeeded = (
    isSet: boolean, appointmentType: EAppointmentTimingType,
    sliceIdx: number, groupedAppointments: TGroupedAppointments, displayItems: number,
    appointmentDate: ParsableDate|undefined
): boolean => {
    return !isSet
        && appointmentType === EAppointmentTimingType.PreferredDate
        && !sliceIdx
        && Object.keys(groupedAppointments).length > displayItems
        && Boolean(appointmentDate)
}

export const validatePhoneNumber = (value: string): string => {
    if (value) {
        value = `+${value.replace(/[^0-9.]/g, '')}`;
    }
    return value;
}

export const getAppointmentDate = (appointment: IAppointmentByQuery) => {
    const date = `${String(appointment.dateInUtc).split("T")[0]}T${appointment.timeSlot}Z`;
    return moment.utc(date);
}
export const getAppointmentVehicle = ({vehicle}: IAppointmentByQuery) => {
    return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
}

export const encodeSCID = (id: number): string => {
    return encode(btoa(String(id)));
}
export const decodeSCID = (id: string): number => {
    try {
        return Number(atob(decode(id)));
    } catch {
        return 0;
    }
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

export const getGroupedAppointmentList = (slots: TGroupedAppointments): TGroupedAppointmentsList[] => {
    const arr: TGroupedAppointmentsList[] = [];
    for (let k in slots) {
        if (slots.hasOwnProperty(k)) {
            arr.push([k, slots[k]]);
        }
    }
    arr.sort((a, b) => {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }
        return 0;
    });
    return arr;
}

export const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Unable to copy', err);
    }
    document.body.removeChild(textArea);
}
export const copyTextToClipboard = (text: string) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(() => {}, (err) => {
        console.error('Async: Could not copy text: ', err);
    });
}

export const parentOrigins = {
    bmwofschererville: "bmwofschererville",
    riverviewford: "riverviewford",
    scherervilleEvenflow: "bmw-schererville.evenflow",
    fremontchryslerdodgejeepcasper: "fremontchryslerdodgejeepcasper",
    fremontchryslerdodgejeeprocksprings: "fremontchryslerdodgejeeprocksprings",
    janssenchryslerjeepdodge: "janssenchryslerjeepdodge",
    janssenfordholdrege: "janssenfordholdrege",
    lakepowellford: "lakepowellford",
    larnedford: "morrissmithfordoflarned",
    performancekingshonda: "performancekingshonda",
    performancehondastore: "performancehondastore",
}

export const getTracker = (origin: string): string => {
    if (process.env.REACT_APP_ENV === "stage") return "UA-210743216-4";
    if (process.env.REACT_APP_ENV === "production") {
        if (origin.includes(parentOrigins.bmwofschererville)) return "UA-210743216-6";
        if (origin.includes(parentOrigins.riverviewford)) return "UA-210743216-3";
        if (origin.includes(parentOrigins.scherervilleEvenflow)) return "UA-210743216-8";
        if (origin.includes(parentOrigins.fremontchryslerdodgejeepcasper)) return "UA-210743216-9";
        if (origin.includes(parentOrigins.fremontchryslerdodgejeeprocksprings)) return "UA-210743216-10";
        if (origin.includes(parentOrigins.janssenchryslerjeepdodge)) return "UA-210743216-11";
        if (origin.includes(parentOrigins.janssenfordholdrege)) return "UA-210743216-12";
        if (origin.includes(parentOrigins.lakepowellford)) return "UA-210743216-13";
        if (origin.includes(parentOrigins.larnedford)) return "UA-210743216-14";
        if (origin.includes(parentOrigins.performancekingshonda)) return "UA-210743216-15";
        if (origin.includes(parentOrigins.performancehondastore)) return "UA-210743216-16";
        return "UA-210743216-5";
    } else {
        return "UA-210743216-5";
    }
}

export const getOptions = (optionsArray: string[]) => {
    const options: TOption[] = [];
    optionsArray.forEach((option, index) => {
        const array = [];
        for (let i = 0; i < option.length; i++) {
            if (option[i] === option[i].toUpperCase() && i > 0) {
                array.push(' ');
            }
            array.push(option[i]);
        }
        options.push({name: array.join(''), value: index});
    })
    return options;
}

export const checkEmail = (email: string|undefined): boolean => {
    if (!email) return false;
    const matches = String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return Boolean(matches);
}