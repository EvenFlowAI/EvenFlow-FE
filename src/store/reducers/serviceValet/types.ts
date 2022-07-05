export interface IZonePriceSettings {
    zoneName: string;
    zoneId: number;
    flatFee: number;
    serviceMultiplier: number;
}

export interface IDistancePriceSettings {
    id: number;
    rangeMin: number;
    rangeMax: number;
    costPerMile: number;
    serviceMultiplier: number;
}

export type TDistanceRange = {
    rangeMin: number;
    rangeMax: number;
    costPerMile: number;
}