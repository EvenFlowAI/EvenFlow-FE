import {IAddress} from "../store/reducers/dealershipGroups/types";
import {ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction} from "react";
import {TCalendarProps, TGroupedAppointments, TGroupedAppointmentsList, TOption} from "./types";
import * as queryString from "querystring";
import {ICurrentUser} from "../store/reducers/users/types";
import {PERMISSIONS} from "../permissions";
import {matchPath} from "react-router-dom";
import {
    EAppointmentTimingType,
    IRemappedAppointmentSlot,
    ISR,
    TRecallForRequest
} from "../store/reducers/appointment/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {
    EMaintenanceOptionType,
    IAppointment,
    ILoadedVehicle,
    IMake,
    IOfferForCategory,
    IPackageOptions,
    IServiceCategory
} from "../api/types";
import moment from "moment";
import {decode, encode} from 'url-safe-base64';
import {ETransportationType} from "../store/reducers/transportationNeeds/types";
import {EServiceCategoryType, ICategory} from "../store/reducers/categories/types";
import {EOfferType} from "../store/reducers/offers/types";
import {EPackagePricingType, IValueService} from "../store/reducers/appointmentFrameReducer/types";
import {IMaintenanceItem, IRecallByVin} from "../types/types";
import {TPackagePrice} from "../store/reducers/packages/types";
import i18n from "../i18n";

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

export const getAppointmentDate = (appointment: IAppointment) => {
    return moment.utc(appointment.dateTime);
}
export const getAppointmentVehicle = ({vehicle}: IAppointment) => {
    return `${vehicle?.make ?? ''} ${vehicle?.model ?? ''} ${vehicle?.year ?? ''}`;
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
    performancelexus: "performancelexus",
    performancelexusrivercenter: "performancelexusrivercenter",
    performancechryslerjeepcenterville: "performancechryslerjeepcenterville",
    performancetoyotastore: "performancetoyotastore",
}

export const getTracker = (origin: string): string => {
    if (process.env.REACT_APP_ENV === "uat") return "G-ZW2CJN5R98";
    // if (process.env.REACT_APP_ENV === "stage") return "UA-210743216-4";
    if (process.env.REACT_APP_ENV === "production") {
        if (origin.includes(parentOrigins.bmwofschererville)) return "UA-210743216-6";
        //if (origin.includes(parentOrigins.riverviewford)) return "UA-210743216-3";
        if (origin.includes(parentOrigins.riverviewford)) return "G-NBXVY09B7S";
        if (origin.includes(parentOrigins.scherervilleEvenflow)) return "UA-210743216-8";
        if (origin.includes(parentOrigins.fremontchryslerdodgejeepcasper)) return "G-FBF51NY0TY";
        //if (origin.includes(parentOrigins.fremontchryslerdodgejeepcasper)) return "UA-210743216-9";
        if (origin.includes(parentOrigins.fremontchryslerdodgejeeprocksprings)) return "G-9DVYXDJ45M";
        //if (origin.includes(parentOrigins.fremontchryslerdodgejeeprocksprings)) return "UA-210743216-10";
        if (origin.includes(parentOrigins.janssenchryslerjeepdodge)) return "G-7177QY7LH2";
        //if (origin.includes(parentOrigins.janssenchryslerjeepdodge)) return "UA-210743216-11";
        if (origin.includes(parentOrigins.janssenfordholdrege)) return "G-YXMH70Q2JX";
        //if (origin.includes(parentOrigins.janssenfordholdrege)) return "UA-210743216-12";
        if (origin.includes(parentOrigins.lakepowellford)) return "G-HS4HDY3376";
        //if (origin.includes(parentOrigins.lakepowellford)) return "UA-210743216-13";
        if (origin.includes(parentOrigins.larnedford)) return "G-4BFDSPFKH6";
        //if (origin.includes(parentOrigins.larnedford)) return "UA-210743216-14";
        if (origin.includes(parentOrigins.performancekingshonda)) return "G-P3DH15MW8P";
        //if (origin.includes(parentOrigins.performancekingshonda)) return "UA-210743216-15";
        if (origin.includes(parentOrigins.performancehondastore)) return "G-JFFE7XLTF5";
        //if (origin.includes(parentOrigins.performancehondastore)) return "UA-210743216-16";
        if (origin.includes(parentOrigins.performancelexusrivercenter)) return "G-3074D59PM3";
        //if (origin.includes(parentOrigins.performancelexusrivercenter)) return "UA-210743216-18";
        if (origin.includes(parentOrigins.performancelexus)) return "G-5XJ8256YEZ";
        //if (origin.includes(parentOrigins.performancelexus)) return "UA-210743216-17";
        if (origin.includes(parentOrigins.performancechryslerjeepcenterville)) return "G-EEJPTXTVF2";
        //if (origin.includes(parentOrigins.performancechryslerjeepcenterville)) return "UA-210743216-19";
        if (origin.includes(parentOrigins.performancetoyotastore)) return "G-HXLXXZQ4YB";
        //if (origin.includes(parentOrigins.performancetoyotastore)) return "UA-210743216-20";
        return "G-DWX0X9CBTT";
        //return "UA-210743216-5";
    } else {
        return "G-LS5EEY1SRM";
        //return "UA-210743216-5";
    }
}

const ServiceCenters = {
    HennessysRiverViewFordQuickLane: 2,
    HennessysRiverViewFordMainServiceDrive: 6,
    FremontCDJRCasper: 7,
    FremontCDJRRockSprings: 8,
    JanssenCDJRofNorthPlatte: 9,
    JanssenSonsFord: 10,
    MorrisSmithFordOfLarned: 13,
    PerformanceKingsHondaCincinnati: 14,
    PerformanceHondaFairfield: 15,
    PerformanceLexusCincinnati: 16,
    PerformanceLexusRiverCenter: 17,
    PerformanceCDJRCenterville: 18,
    PerformanceToyotaFairfield: 19,
    LeeJanssenMotorCompanyChevrolet: 20,
    LakePowellFord: 35,
    TestBmwOfSchererville: 123,
    FremontMotorRiverton: 22,
    FremontMotorCody: 23,
    FremontMotorPowell: 24,
    FremontLanderFord: 26,
    FremontLanderCDJR: 27,
    BeloitAutoAndTruck: 30,
}

export const getTrackerById = (id: string): string => {
    const decodedId = decodeSCID(id);
    if (process.env.REACT_APP_ENV === "uat") return "G-ZW2CJN5R98";
    // if (process.env.REACT_APP_ENV === "stage") return "UA-210743216-4";
    if (process.env.REACT_APP_ENV === "production") {
        if (decodedId === ServiceCenters.TestBmwOfSchererville) return "UA-210743216-6";
        //if (origin.includes(parentOrigins.riverviewford)) return "UA-210743216-3";
        if (decodedId === ServiceCenters.HennessysRiverViewFordQuickLane) return "G-NBXVY09B7S";
        // todo its own property in GA
        if (decodedId === ServiceCenters.HennessysRiverViewFordMainServiceDrive) return "G-NBXVY09B7S";
        if (origin.includes(parentOrigins.scherervilleEvenflow)) return "UA-210743216-8";
        if (decodedId === ServiceCenters.FremontCDJRCasper) return "G-FBF51NY0TY";
        if (decodedId === ServiceCenters.FremontCDJRRockSprings) return "G-9DVYXDJ45M";
        if (decodedId === ServiceCenters.JanssenCDJRofNorthPlatte) return "G-7177QY7LH2";
        if (decodedId === ServiceCenters.JanssenSonsFord) return "G-YXMH70Q2JX";
        if (decodedId === ServiceCenters.LakePowellFord) return "G-HS4HDY3376";
        if (decodedId === ServiceCenters.MorrisSmithFordOfLarned) return "G-4BFDSPFKH6";
        if (decodedId === ServiceCenters.PerformanceKingsHondaCincinnati) return "G-P3DH15MW8P";
        if (decodedId === ServiceCenters.PerformanceHondaFairfield) return "G-JFFE7XLTF5";
        if (decodedId === ServiceCenters.PerformanceLexusRiverCenter) return "G-3074D59PM3";
        if (decodedId === ServiceCenters.PerformanceLexusCincinnati) return "G-5XJ8256YEZ";
        if (decodedId === ServiceCenters.PerformanceCDJRCenterville) return "G-EEJPTXTVF2";
        if (decodedId === ServiceCenters.PerformanceToyotaFairfield) return "G-HXLXXZQ4YB";
        if (decodedId === ServiceCenters.FremontMotorRiverton) return "G-YT0WTD548Z";
        if (decodedId === ServiceCenters.FremontMotorCody) return "G-JZ5SG376SH";
        if (decodedId === ServiceCenters.FremontMotorPowell) return "G-4853N7VZ21";
        if (decodedId === ServiceCenters.FremontLanderFord) return "G-VSQ7H51M2D";
        if (decodedId === ServiceCenters.FremontLanderCDJR) return "G-5BV7X721KQ";
        if (decodedId === ServiceCenters.BeloitAutoAndTruck) return "G-0YK1QM06NR";
        return "G-DWX0X9CBTT";
    } else {
        return "G-LS5EEY1SRM";
    }
}

export const getOptions = (optionsArray: string[]): TOption[] => {
    const options: TOption[] = [];
    optionsArray.forEach((option, index) => {
        const array = [];
        for (let i = 0; i < option.length; i++) {
            if (option[i] === option[i].toUpperCase() && i > 0 && Number.isNaN(+option[i-1])) {
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

export const truncateMakes = (makes: IMake[]): IMake[] => {
    const formattedData: IMake[] = [];
    makes.forEach(make => {
        const formattedMake = {...make};

        if (formattedMake.name.length > 30) {
            formattedMake.name = formattedMake.name.slice(0, 26).concat('...');
        }
        formattedMake.models = formattedMake.models
            .map(model => model.length > 30
                ? model.slice(0, 26).concat('...')
                : model)
        formattedData.push(formattedMake);
    })
    return formattedData;
}

export const getTransportationOptionString = (option: string) => {
    const string = ETransportationType[+option];
    const array = [];
    if (string) {
        for (let i = 0; i < string.length; i++) {
            if (string[i] === string[i].toUpperCase() && i > 0) {
                array.push(' ')
            }
            array.push(string[i])
        }
    }
    return array.join('');
}

export const getStartEndDates = (date: moment.Moment, isXS: boolean): [string, string] => {
    const utcOffset = moment(date).utcOffset();
    if (isXS) {
        return [
            moment(date).startOf("day").add(utcOffset, 'minutes').toISOString(),
            moment(date).endOf("day").add(utcOffset, 'minutes').toISOString()
        ]
    }
    let correctedDate = date;
    const dayOfWeek = moment(date).day();
    if (dayOfWeek === 0) correctedDate = moment(date).subtract('1', 'days');
    return [
        moment(correctedDate).startOf("week").add(1, 'days').add(utcOffset, 'minutes').toISOString(),
        moment(correctedDate).endOf("week").add(1, 'days').add(utcOffset, 'minutes').toISOString(),
    ]
}

export const getYearOptions = () => {
    let year = moment.utc().year()
    if (moment().month() > 6) year = moment.utc().add(1, 'year').year();
    const YEARS = year - 1982;
    return Array(YEARS).fill(0).map((_, idx) => String(year - idx));
}

export const collectServiceRequestIds = (
    s: IServiceCategory | null,
    sub: IServiceCategory | null,
    selectedPackage?: IPackageOptions | null,
    individualOpsCodes?: number[],
    selectedRecalls?: IRecallByVin[]): number[] => {
    let ids = [];

    if (selectedRecalls?.length) {
        selectedRecalls.forEach(item => ids.push(item.serviceRequestId))
    }
    if (individualOpsCodes?.length) {
        for (let c of individualOpsCodes) {
            ids.push(c);
        }
    }
    const set = new Set(ids)
    return Array.from(set);
}

export const getOfferString = (offer: IOfferForCategory, isRoundPrice: boolean): string => {
    switch (offer.type) {
        case EOfferType.AmountOff:
            return `$${isRoundPrice ? offer.valueOff : offer.valueOff?.toFixed(2)} Off`;
        case EOfferType.PercentOff:
            return `${offer.valueOff}% Off`;
        case EOfferType.FreeService:
            return offer.title;
        default:
            return '';
    }
}

export const mapRecallsForRequest = (selectedRecalls: IRecallByVin[]): TRecallForRequest[] => {
    return selectedRecalls.map(recall => {
        const data: TRecallForRequest = {
            serviceRequestId: recall.serviceRequestId,
            number: recall.nhtsaRecallNumber,
        }
        if (recall.id) data.id = recall.id;
        return data;
    })
}

export const getCategories = (allCategories: ICategory[], categoriesIds: number[]): number[] => {
    return allCategories
        .filter(category => {
            return category.type === EServiceCategoryType.GeneralCategory
                && categoriesIds.includes(category.id)
        })
        .map(item => item.id)
}

export const getVehicleData = (selectedVehicle: ILoadedVehicle | null, valueService: IValueService | null): (string | null)[] => {
    const make = selectedVehicle?.make?.length
        ? selectedVehicle?.make
        : valueService
            ? "BMW"
            : null;
    const model = selectedVehicle?.model?.length
        ? selectedVehicle?.model
        : valueService?.series?.name
            ? valueService.series.name
            : null;
    const year = selectedVehicle?.year
        ? String(selectedVehicle.year)
        : valueService?.year?.year
            ? String(valueService.year.year)
            : null;
    return [make, model, year];
}
export const getMaintenanceDescription = (
    srList: ISR[],
    selectedRecalls: IRecallByVin[],
    packagePriceTitles: TPackagePrice[],
    selectedSR?: number[],
    selectedPackage?: IPackageOptions | null,
    allCategories?: ICategory[],
    selectedCategories?: number[],
    valueService?: IValueService | null,
    packagePricingType?: EPackagePricingType | null,
    packageEMenuType?: EMaintenanceOptionType | null,
    optionTypes?: EMaintenanceOptionType[] | undefined,
) => {
    const services: string[] = [];

    if (selectedPackage) {
        let name = `${selectedPackage.name} ${i18n.t("package")}`;
        if (packagePriceTitles?.length) {
            const price = packagePriceTitles.find(item => item.type === packagePricingType);
            if (price) name = name + ` (${price.title})`;
        }
        services.push(name)
    } else {
        if (packageEMenuType !== null && optionTypes?.length) {
            const firstOption = optionTypes[0];
            const name = packageEMenuType === firstOption
                ? i18n.t("Factory Package")
                : i18n.t("Dealer Package");
            services.push(i18n.t(name));
        }
    }
    if (selectedSR?.length) {
        const filtered = srList.filter(el => selectedSR.includes(el.id)).map(el => el.description);
        filtered.forEach(item => item && services.push(item));
    }
    if (selectedCategories && allCategories) {
        const categories = allCategories.filter(category => selectedCategories.includes(category.id))
        categories.forEach(item => {
            if (item.name.includes("Going")) {
                services.push(i18n.t("My Description of Needs"))
            } else {
                if (item.type === EServiceCategoryType.GeneralCategory) services.push(item.name)
            }
        })
    }
    if (valueService?.selectedService?.name) services.push(valueService.selectedService.name)
    selectedRecalls.forEach(el => services.push(el.shortDescription))
    return services;
}
export const getMaintenanceList = (
    srList: ISR[],
    selectedRecalls: IRecallByVin[],
    selectedSR?: number[],
    selectedPackage?: IPackageOptions | null,
    allCategories?: ICategory[],
    selectedCategories?: number[],
    valueService?: IValueService | null,
    packageEMenuType?: EMaintenanceOptionType | null,
    optionTypes?: EMaintenanceOptionType[] | undefined,
) => {
    const services: IMaintenanceItem[] = [];

    if (selectedPackage) {
        services.push({
            name: `${selectedPackage.name} ${i18n.t("package")}`,
            id: selectedPackage.id,
            type: 'package',
        })
    }
    if (selectedSR?.length) {
        const filtered = srList.filter(el => selectedSR.includes(el.id));
        filtered.forEach(item => item && services.push({
            id: item.id,
            name: item.description ?? item.code,
            type: 'service'
        }));
    }
    if (selectedCategories && allCategories) {
        const categories = allCategories.filter(category => selectedCategories.includes(category.id) && category.type === EServiceCategoryType.GeneralCategory)
        categories.forEach(item => {
            if (item.type === EServiceCategoryType.GeneralCategory) {
                services.push({
                    id: item.id,
                    name: item.name,
                    type: 'category'
                })
            }
        })
    }
    if (valueService?.selectedService) {
        services.push({
            id: valueService.selectedService.id,
            name: valueService.selectedService.name,
            type: 'valueService'
        })
    }
    if (packageEMenuType !== null && optionTypes?.length) {
        const firstOption = optionTypes[0];
        services.push({
            type: "package",
            name: `${packageEMenuType === firstOption ? i18n.t("Factory") : i18n.t("Dealer")} Package`
        })
    }
    if (selectedRecalls.length) {
        selectedRecalls.forEach(item => {
            services.push({
                id: item.serviceRequestId,
                name: item.shortDescription,
                type: "recall",
                nhtsaRecallNumber: item.nhtsaRecallNumber,
            })
        })
    }
    return services;
}