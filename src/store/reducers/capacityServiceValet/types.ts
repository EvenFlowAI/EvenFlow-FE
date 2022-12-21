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

export enum EZoneTimeGap {
    Small = 15, Medium = 30, Large = 60
}

export enum ETimeWindows {
    Timewindow1,
    Timewindow2,
    Timewindow3,
    Timewindow4,
    Timewindow5,
    Timewindow6,
    Timewindow7,
    Timewindow8,
    Timewindow9,
    Timewindow10,
    Timewindow11,
    Timewindow12,
    DropOffPeriod,
    NotAvailable

}

export interface IZoneTimeWindow {
    id: number;
    zoneId: number;
    zoneName: string;
    timeSlotType: EZoneTimeGap;
    timeWindow: ETimeWindows;
    start: string;
}