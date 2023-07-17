import moment from "moment";
import {
    ILoadedVehicle,
    IOfferForCategory,
    IPackage,
    IPackageOptions,
    IServiceCategory,
} from "../../../api/types";
import {TComplimentary, TPackage, TService, TUpsell} from "./PackageSelection";
import {EOfferType} from "../../../store/reducers/offers/types";
import {EServiceType, IValueService} from "../../../store/reducers/appointmentFrameReducer/types";
import {TScreen} from "../../Layout/types";
import {IRecallByVin} from "./types";
import {TRecallForRequest} from "../../../store/reducers/appointment/types";
import {EServiceCategoryType, ICategory} from "../../../store/reducers/categories/types";

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

export const getPackagesData = (loadedPackages: IPackage[]): [TPackage[], TService[], TComplimentary[], TUpsell[]] => {
    if (loadedPackages.length) {
        const loadedPackage = loadedPackages[0];
        const services: TService[] = [];
        const packages: TPackage[] = [];
        const complimentary: TComplimentary[] = [];
        const upsells: TUpsell[] = [];

        for (let option of loadedPackage.options.sort((a, b) => a.type - b.type)) {
            packages.push({
                ...option,
                moreIdx: []
            })
            for (let service of option.serviceRequests) {
                const pushedService = services.find(s => s.id === service.id);
                if (!pushedService) {
                    services.push({
                        ...service, packages: [option.id]
                    })
                } else if (!pushedService.packages.includes(option.id)) {
                    pushedService.packages = [...pushedService.packages, option.id];
                }
            }
            for (let comp of option.complimentaryServices) {
                const present = complimentary.find(c => c.id === comp.id);
                if (!present) {
                    complimentary.push({
                        ...comp,
                        packages: [option.id]
                    })
                } else if (!present.packages.includes(option.id)) {
                    present.packages = [...present.packages, option.id];
                }
            }
            if (option.intervalUpsells) {
                for (let upsell of option.intervalUpsells) {
                    const present = upsells.find(c => c.id === upsell.id);
                    if (!present) {
                        upsells.push({
                            ...upsell,
                            packages: [option.id]
                        })
                    } else if (!present.packages.includes(option.id)) {
                        present.packages = [...present.packages, option.id];
                    }
                }
            }
            services.reduce((acc, s, idx) => {
                if (acc.pck.length > s.packages.length) {
                    const lastPackageId = acc.pck[0];
                    const p = packages.find(p => p.id === lastPackageId);
                    if (p) {
                        p.lastIdx = idx - 1;
                        if (acc.moreIdx) {
                            const np = packages.find(el => el.id === acc.moreIdx);
                            if (np) {
                                np.moreIdx = [...acc.more];
                            }
                        }
                        acc.moreIdx = s.packages[0];
                        acc.more = [idx];
                    }
                } else if (acc.more.length) {
                    acc.more.push(idx);
                }
                if (idx === (services.length - 1) && acc.moreIdx) {
                    const np = packages.find(el => el.id === acc.moreIdx);
                    if (np) {
                        np.moreIdx = [...acc.more];
                    }
                }
                return {...acc, pck: s.packages};
            }, {pck: [], more: [], moreIdx: 0} as { pck: number[], more: number[], moreIdx: number });
        }

        return [packages, services, complimentary, upsells];
    }
    return [[], [], [], []];
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

export const getCurrentMenu = (serviceType: EServiceType, advisor: boolean, transportation: boolean): string[] => {
    const menu = {
        yourLocation: "Your Location",
        serviceNeeds: "Service Needs",
        advisorSelection: "Advisor Selection",
        appointmentSelection: "Appointment Selection",
        transportationNeeds: "Transportation Needs",
        appointmentConfirmation: "Appointment Confirmation",
    }
    if (!advisor) delete menu.advisorSelection;
    if (!transportation) delete menu.transportationNeeds;
    if (serviceType === EServiceType.VisitCenter) delete menu.yourLocation;
    return Object.values(menu);
}

export const getStepsScreen = (serviceType: EServiceType, advisorSelection: boolean, appointmentSelection: boolean,
                               transportationNeeds: boolean): TScreen[] => {
    const screens: {[key: string]: TScreen} = {
        location: "location",
        serviceNeeds: "serviceNeeds",
        consultantSelection: "consultantSelection",
        appointmentSelection: appointmentSelection ? "appointmentTiming" : "appointmentSelection",
        transportationNeeds: "transportationNeeds",
        appointmentConfirmation: "appointmentConfirmation",
    }
    if (!advisorSelection) delete screens.consultantSelection;
    if (!transportationNeeds) delete screens.transportationNeeds;
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
