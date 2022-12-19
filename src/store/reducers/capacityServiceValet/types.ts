export enum EDaysFromMonday {
    Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
}

export interface IZoneRouting {
    id: number;
    name: string;
}

export interface IZonesRoutingByDay {
    id: number;
    day: EDaysFromMonday;
    zones: IZoneRouting[]
}