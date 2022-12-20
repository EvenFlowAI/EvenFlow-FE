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
    TimeWindowOne,
    TimeWindowTwo,
    TimeWindowThree,
    TimeWindowFour,
    TimeWindowFive,
    TimeWindowSix,
    TimeWindowSeven,
    TimeWindowEight,
    TimeWindowNine,
    TimeWindowTen,
    TimeWindowEleven,
    TimeWindowTwelve,
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
    end: string;
}