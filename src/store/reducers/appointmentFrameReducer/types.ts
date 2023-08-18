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