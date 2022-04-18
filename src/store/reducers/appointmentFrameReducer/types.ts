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

export type TValueService = {
    name: string;
    price: number;
    description: string;
    imageLink: string;
}
export type TSeries = {
    name: string;
    models: string[];
}

export type TYear = {
    year: string;
    series: TSeries[];
}
export interface IValueService {
    year: TYear | null;
    model: string | null;
    series: TSeries | null;
    selectedService: TValueService | null;
}