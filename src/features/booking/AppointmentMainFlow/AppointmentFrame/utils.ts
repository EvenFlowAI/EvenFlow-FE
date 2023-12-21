import moment from "moment";
import {ILoadedVehicle, IOfferForCategory, IPackageOptions, IServiceCategory,} from "../../../../api/types";
import {EOfferType} from "../../../../store/reducers/offers/types";
import {EServiceType, IValueService} from "../../../../store/reducers/appointmentFrameReducer/types";
import {IRecallByVin, TParsedAddress} from "./types";
import {TRecallForRequest} from "../../../../store/reducers/appointment/types";
import {EServiceCategoryType, ICategory} from "../../../../store/reducers/categories/types";
import {TScreen} from "../../../../types/types";

export const getAppointmentDate = (date: moment.Moment, d: number) => {
    return moment.utc(date).date(d).startOf('day').toISOString().replace('.000', '');
}

export const collectServiceRequestIds = (
    s: IServiceCategory|null,
    sub: IServiceCategory|null,
    selectedPackage?: IPackageOptions|null,
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

export const checkSelectedCar = (vehicle: ILoadedVehicle|null, vehicles?: ILoadedVehicle[]): boolean => {
    if (!vehicles || !vehicle) {
        return false;
    }
    return Boolean(vehicles.find(v => {
        if (vehicle.vin && v.vin) {
            return vehicle?.mileage && vehicle.vin === v.vin;
        }
        return vehicle?.mileage
            && vehicle.year === v.year
            && vehicle.make === v.make
            && vehicle.model === v.model;
    }))
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

type TData = { [K in TScreen]: number };

export const getCurrentMenu = (serviceType: EServiceType, advisor: boolean, transportation: boolean, isManaging: boolean): string[] => {
    const menu = {
        yourLocation: "Your Location",
        serviceNeeds: "Service Needs",
        advisorSelection: "Advisor Selection",
        appointmentSelection: "Appointment Selection",
        transportationNeeds: "Transportation Needs",
        appointmentConfirmation: "Appointment Confirmation",
        manageAppointment: "Manage Appointment",
    }
    if (!advisor) delete menu.advisorSelection;
    if (!transportation) delete menu.transportationNeeds;
    if (!isManaging) {
        delete menu.manageAppointment;
    } else {
        delete menu.appointmentConfirmation;
    }
    if (serviceType === EServiceType.VisitCenter) delete menu.yourLocation;
    return Object.values(menu);
}

export const getStepsScreen = (serviceType: EServiceType, advisorSelection: boolean, appointmentSelection: boolean,
                               transportationNeeds: boolean, isManaging: boolean): TScreen[] => {
    const screens: {[key: string]: TScreen} = {
        location: "location",
        serviceNeeds: "serviceNeeds",
        consultantSelection: "consultantSelection",
        appointmentSelection: appointmentSelection ? "appointmentTiming" : "appointmentSelection",
        transportationNeeds: "transportationNeeds",
        appointmentConfirmation: "appointmentConfirmation",
        manageAppointment: "manageAppointment",
    }
    if (!advisorSelection) delete screens.consultantSelection;
    if (!transportationNeeds) delete screens.transportationNeeds;
    if (!isManaging) {
        delete screens.manageAppointment;
    } else {
        delete screens.appointmentConfirmation;
    }
    if (serviceType === EServiceType.VisitCenter) delete screens.location;
    return Object.values(screens);
}

export const getStepsMap = (serviceType: EServiceType, isAdvisorAvailable: boolean, isAppointmentSelection: boolean,
                            isTransportationNeeds: boolean): {[K in TScreen]: number} => {
    const data: { [K in TScreen]: number } = {
        carSelection: 0,
        serviceNeeds: serviceType === EServiceType.VisitCenter ? 1 : 2,
        maintenanceDetails: serviceType === EServiceType.VisitCenter ? 1 : 2,
        serviceSelection: serviceType === EServiceType.VisitCenter ? 1 : 2,
        packageSelection: serviceType === EServiceType.VisitCenter ? 1 : 2,
        describeMore: serviceType === EServiceType.VisitCenter ? 1 : 2,
        opsCode: serviceType === EServiceType.VisitCenter ? 1 : 2,
        vehicleData: serviceType === EServiceType.VisitCenter ? 1 : 2,
        serviceOfferProductPage: serviceType === EServiceType.VisitCenter ? 1 : 2,
        consultantSelection: serviceType === EServiceType.VisitCenter ? 2 : serviceType === EServiceType.MobileService ? -1 : 3,
        appointmentTiming: serviceType === EServiceType.PickUpDropOff ? 4 : 3,
        appointmentSelection: serviceType === EServiceType.PickUpDropOff ? 4 : 3,
        transportationNeeds: serviceType === EServiceType.VisitCenter ? 4 : -1,
        appointmentConfirmation: serviceType === EServiceType.MobileService ? 4 : 5,
        manageAppointment: serviceType === EServiceType.MobileService ? 4 : 5,
        appointmentConfirmed: serviceType === EServiceType.MobileService ? 4 : 5,
        location: 1,
        payment: 5,
    }
    if (!isAdvisorAvailable && data.consultantSelection > -1) {
        for (let key in data) {
            if (data[key as keyof TData] > data.consultantSelection) {
                data[key as keyof TData] = data[key as keyof TData] - 1
            }
        }
        data.consultantSelection = -1;
    }
    if (!isAppointmentSelection) {
        data.appointmentTiming = -1;
    }
    if ((!isTransportationNeeds) && data.transportationNeeds > -1) {
        for (let key in data) {
            if (data[key as keyof TData] > data.transportationNeeds) {
                data[key as keyof TData] = data[key as keyof TData] - 1
            }
        }
        data.transportationNeeds = -1;
    }
    return data
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

export const getVehicleData = (selectedVehicle: ILoadedVehicle|null, valueService: IValueService|null): (string|null)[] => {
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

export const getCategories = (allCategories: ICategory[], categoriesIds: number[]): number[] => {
    return allCategories
        .filter(category => {
            return category.type === EServiceCategoryType.GeneralCategory
                && categoriesIds.includes(category.id)
        })
        .map(item => item.id)
}
export const SCREENS = {
    carSelection: 'Car Selection',
    serviceNeeds: 'Service Needs',
    packageSelection: 'Package Selection',
    maintenanceDetails: 'Car Details',
    carDetails: 'Car Details',
    consultantSelection: 'Consultant Selection',
    serviceSelection: 'Service Selection',
    describeMore: 'Describe More',
    appointmentConfirmation: 'Appointment Confirmation',
    appointmentSelection: 'Appointment Selection',
    appointmentConfirmed: 'Appointment Confirmed',
    appointmentTiming: 'Appointment Timing',
    transportationNeeds: 'Transportation Needs',
    opsCode: "opsCode",
    vehicleData: "vehicleData",
    location: "Your Location",
    payment: "payment",
    serviceOfferProductPage: "Service Offer Produce Page",
    manageAppointment: "Manage Appointment",
}

// todo add new parent links while go live with new dealerships
export const prodParentLinks = [
    'https://apps.evenflow.ai/',
    'https://www.riverviewford.com/',
    "https://www.bmwofschererville.com/",
    "https://bmw-schererville.evenflow.services",
    "https://www.fremontchryslerdodgejeepcasper.com",
    "https://www.fremontchryslerdodgejeeprocksprings.com",
    "https://www.janssenfordholdrege.com/",
    "https://www.janssenchryslerjeepdodge.com/",
    "https://www.lakepowellford.com/",
    "https://www.morrissmithfordoflarned.com/",
    "https://www.performancekingshonda.com/",
    "https://www.performancehondastore.com/",
    "https://www.performancelexus.com/",
    "https://www.performancelexusrivercenter.com/",
    "https://www.performancechryslerjeepcenterville.com/",
    "https://www.performancetoyotastore.com/",
];

export const parseGeoCode = (data: any[], addressString: string, mainText?: string, secondaryText?: string): TParsedAddress => {
    let city = data.find(el => el.types?.includes('locality'));
    if (!city) city = data.find(el => el.types?.includes('sublocality'));
    if (!city) city = data.find(el => el.types?.includes('colloquial_area'));

    const state = data.find(el => el?.types?.includes("administrative_area_level_1"))
    let address = mainText;
    let cityName = city?.short_name ?? '';

    const postalCode = data.find(el => el?.types?.includes("postal_code"));

    if (cityName && !addressString.includes(cityName)) cityName = city?.long_name ?? '';

    if (city && secondaryText?.includes(city.long_name)) {
        let index = addressString.lastIndexOf(city?.short_name)
        if (index <=0) index = addressString.lastIndexOf(city?.long_name)
        if (index > 0) {
            address = addressString.slice(0, index)
            const commaIndex = address.lastIndexOf(",")
            if (commaIndex) {
                address = address.slice(0, commaIndex)
            }
        }
    } else {
        cityName = secondaryText?.split(',')[0].trim();
    }

    return {city: cityName ?? '', state: state?.short_name ?? '', address: address ?? '', postalCode: postalCode?.long_name ?? ''}
}