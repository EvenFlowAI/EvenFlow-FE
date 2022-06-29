export type TZipCode = {
    code: string;
    id: number;
}

export type TZoneNew = {
    name: string;
    zipCodes: TZipCode[];
}

export type TZone = {
    name: string;
    id: number;
    zipCodes: TZipCode[];
}

export type TZonesServiceType = "serviceValet" | "mobileService";
