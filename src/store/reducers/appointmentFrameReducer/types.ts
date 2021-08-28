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
    id?: number;
    hashKey?: string;
}
export type TMaintenanceDetails = {
    year?: string;
    model?: string;
    trim?: string;
    powertrain?: string;
    oilType?: string;
    serviceInterval?: string;
}