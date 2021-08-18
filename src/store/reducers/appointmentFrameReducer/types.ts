export enum ECardType {
    Maintenance,
    TellMore,
    Other
}
export type TCardName =
    | "FoD"
    | "QLC"
    | "R"
    | "TM";

export type TServiceCard = {
    label: string;
    icon: JSX.Element;
    name: TCardName;
    type: ECardType
}