import {
    EMaintenanceOptionType,
    IAppointmentByKey,
    ICustomer,
    ILoadedVehicle,
    IMake,
    IPackage,
    IPackageOptions,
    IServiceCategory,
    IServiceConsultant,
    ITransportation
} from "../../../api/types";
import {EAppointmentTimingType, EReminderType, IServiceRequestPrice} from "../appointment/types";
import moment from "moment/moment";
import {IRecallByVin, TScreen, TView} from "../../../types/types";
import {IHOODataForm} from "../serviceCenters/types";
import {IFirstScreenOption} from "../serviceTypes/types";
import {TPackagePrice} from "../packages/types";

export interface IAppointmentId {
    id: number;
    hashKey: string;
}

export interface IMaintenanceDetailsShort {
    year?: string;
    make?: string;
    model?: string;
    serviceInterval?: string;
    mileage?:string;
}

export interface TMaintenanceDetails extends IMaintenanceDetailsShort {
    trim?: string;
    powertrain?: string;
    oilType?: string;
    engineTypeId?: number|null;
    vin?: string;
}

export enum EUserType {
    New,
    Existing
}

export enum EServiceType {
    VisitCenter,
    MobileService,
    PickUpDropOff,
    General
}

export type TModel = {
    id: number;
    name: string;
}

export type TSeries = {
    name: string;
    models: TModel[];
    id: number;
}

export type TYear = {
    year: number;
    series: TSeries[];
}
export interface IValueService {
    year: TYear | null;
    model: TModel | null;
    series: TSeries | undefined;
    selectedService: IServiceOffer | null;
}

export interface IServiceOffer  {
    id: number;
    name: string;
    price: number;
    imagePath: string;
    description: string;
}

export type TLanguage = "en" | "es";

export interface IAncillaryByZipRequest {
    address: string;
    zipCode: string;
    serviceCenterId: number;
    serviceTypeOptionId: number|null;
}

export enum EAncillaryType {
    Amount, Percent
}

export type TAncillaryPriceByZip = {
    feeAmount: number|null;
    feeType: EAncillaryType;
}

export enum EPackagePricingType {
    BasePrice,
    PriceWithFee
}

export type TEditingPosition = 'address' | 'serviceOption' | 'slot' | 'serviceRequests' | 'advisor' | 'transportation'

export type TState = {
    service: IServiceCategory | null;
    subService: IServiceCategory | null;
    description: string;
    selectedPackage: IPackageOptions | null;
    advisor: IServiceConsultant | null;
    isAnyAdvisorSelected: boolean;
    selectedTiming: EAppointmentTimingType | null;
    selectedTime: moment.Moment | null;
    selectedVehicle: ILoadedVehicle | null;
    customer: ICustomer;
    reminders: EReminderType[];
    transportation: ITransportation | null;
    maintenanceDetails: TMaintenanceDetails;
    packages: IPackage[];
    isPackagesLoading: boolean;
    consultants: IServiceConsultant[];
    isConsultantsLoading: boolean;
    currentScreen: TScreen | '';
    prevScreen: TScreen | '';
    makes: IMake[];
    models: string[];
    trackerCreated: boolean;
    isAdditionalServices: boolean;
    packageIsSelected: boolean;
    packageOptionType: number | null;
    categoriesIds: number[];
    id?: number;
    hashKey?: string;
    gap: number | undefined;
    userType: EUserType | undefined;
    address: any;
    politicalState: string;
    city: string;
    zipCode: string;
    streetName: string;
    valueService: IValueService | null;
    seriesModels: TYear[];
    offersLoading: boolean;
    serviceOffers: IServiceOffer[];
    isMobileServiceOn: boolean;
    isPickUpDropOffServiceOn: boolean;
    isValueServiceOn: boolean;
    sideBarSteps: TScreen[];
    sideBarMenu: string[];
    sideBarActualSteps: { [K in TScreen]: number } | null;
    sideBarStepsList: TScreen[];
    welcomeScreenView: TView;
    language: TLanguage;
    ancillaryPriceLoading: boolean;
    ancillaryPrice: TAncillaryPriceByZip | null;
    filteredZipCodes: string[];
    selectedRecalls: IRecallByVin[];
    recallsAreShown: boolean;
    hoursOfOperations: IHOODataForm[];
    serviceTypeOption: IFirstScreenOption | null;
    selectedOptionTypes: EServiceType[];
    selectedServiceOptions: IFirstScreenOption[];
    prevSelectedOption: IFirstScreenOption | null;
    packagePricingType: EPackagePricingType | null;
    packagePriceTitles: TPackagePrice[];
    packageEMenuType: EMaintenanceOptionType | null;
    slotsConsultantId: string | null;
    shouldShowServiceCentersList: boolean;
    isAppointmentSaving: boolean;
    appointmentByKey: IAppointmentByKey | null;
    carIsValidForUpdate: boolean;
    isUsualFlowNeeded: boolean;
    editingPosition: TEditingPosition | null;
    appointmentRequestsPrices: IServiceRequestPrice[];
    appointmentNotes: string;
    serviceOptionChangedFromSlotPage: boolean;
    transactionValue: number;
    passedScreens: TScreen[];
}