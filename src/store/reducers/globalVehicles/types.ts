export interface IGlobalMake {
    id: number;
    vehiclesPercentage: number;
    vehiclesCount: number;
    vinMake: string;
    accepted: boolean;
    parent?: IGlobalMake;
}

export type TState = {
    makes: IGlobalMake[]
}