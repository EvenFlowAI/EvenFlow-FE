import {IPagingResponse} from "../../../types/types";

export interface IGlobalMake {
    id: number;
    vehiclesPercentage: number;
    vehiclesCount: number;
    vinMake: string;
    accepted: boolean;
    localId: number;
    parent?: IGlobalMake;
    status?: EReviewStatus;
}

export type TOption = {
    id: number;
    name: string;
}

export type TState = {
    makes: IGlobalMake[];
    isLoading: boolean;
    allMakesOptions: IGlobalMake[];
    makesPagination: IPagingResponse;
}

export enum EReviewStatus {
    NotReviewed,
    Confirmed,
    Override
}

export type TReviewOption = "Not Reviewed" | "Confirmed"| "Override"

export type TUpdatedMake = {
    id: number;
    accepted: boolean;
    parentId: number|null;
}