export interface IZonePriceSettings {
    geographicZoneName: string;
    geographicZoneId: number;
    flatFee: number;
    serviceMultiplier: number;
    id: number,
}

export interface IZonePricingUpdate {
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