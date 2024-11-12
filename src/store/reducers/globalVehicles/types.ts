export interface IGlobalMake {
    id: number;
    vehiclesPercentage: number;
    vehiclesCount: number;
    vinMake: string;
    accepted: boolean;
    parent?: IGlobalMake;
}

export type TOption = {
    id: number;
    name: string;
}

export type TState = {
    makes: IGlobalMake[];
    isLoading: boolean;
    allMakesOptions: TOption[];
}

export type TReviewOption = "Not Reviewed" | "Confirmed"| "Override"