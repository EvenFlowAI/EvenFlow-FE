export enum ECardType {
    Maintenance,
    TellMore,
    Other
}
export type TCardName =
    | "FoD"
    | "QLC"
    | "R"
    | "TM"
    | "engineLight"
    | "tireReplacement"
    | "individual"
    | "describe";

export type TServiceCard = {
    label: string;
    icon: JSX.Element;
    name: TCardName;
    type: ECardType
}
export interface IAppointmentId {
    id: number;
    hashKey: string;
}
export type TMaintenanceDetails = {
    year?: string;
    make?: string;
    model?: string;
    trim?: string;
    powertrain?: string;
    oilType?: string;
    serviceInterval?: string;
    mileage?:string;
    engineType?: string;
}

export interface IFrameScreens {
    carSelection: 'Car Selection';
    serviceNeeds: 'Service Needs';
    packageSelection: 'Package Selection';
    maintenanceDetails: 'Car Details';
    carDetails: 'Car Details';
    consultantSelection: 'Consultant Selection';
    serviceSelection: 'Service Selection';
    describeMore: 'Describe More';
    appointmentConfirmation: 'Appointment Confirmation';
    appointmentSelection: 'Appointment Selection';
    appointmentConfirmed: 'Appointment Confirmed';
    appointmentTiming: 'Appointment Timing';
    transportationNeeds: 'Transportation Needs';
    opsCode: "opsCode";
    vehicleData: 'vehicleData';
}

export enum EUserType {
    New,
    Existing
}

export enum EServiceType {
    VisitCenter,
    MobileService,
    PikUpDropOff
}

export type TValueService = {
    name: string;
    price: number;
    description: string;
    imageLink: string;
    id: number;
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
    serviceType: EServiceType;
    serviceCenterId: number;
}

export enum EAncillaryType {
    Amount, Percent
}

export type TAncillaryPriceByZip = {
    feeAmount: number;
    feeType: EAncillaryType;
}