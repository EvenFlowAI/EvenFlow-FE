import { IPagingResponse } from '../../../types/types';

export interface IGlobalMake {
  id: number;
  vehiclesPercentage: number;
  vehiclesCount: number;
  vinMake: string;
  accepted: boolean;
  isReadOnly: boolean;
  localId: number;
  parent?: IGlobalMake;
  status?: EReviewStatus;
}

export interface IGlobalModel {
  id: number;
  vehiclesPercentage: number;
  vehiclesCount: number;
  vinModel: string;
  make: IGlobalMake;
  accepted: boolean;
  isReadOnly: boolean;
  localId: number;
  parent?: IGlobalModel;
  status?: EReviewStatus;
}

export type TOption = {
  id: number;
  name: string;
};

export type TState = {
  allMakesOptions: IGlobalMake[];
  allModelsOptions: IGlobalModel[];
  isLoading: boolean;
  makes: IGlobalMake[];
  makesPagination: IPagingResponse;
  makesStatistic: TVehicleStatistic | null;
  models: IGlobalModel[];
  modelsStatistic: TVehicleStatistic | null;
  modelsPagination: IPagingResponse;
};

export enum EReviewStatus {
  NotReviewed,
  Confirmed,
  Override,
}

export type TReviewOption = 'Not Reviewed' | 'Confirmed' | 'Override';

export type TUpdatedMake = {
  id: number;
  accepted: boolean;
  parentId: number | null;
};

export type TVehicleStatistic = {
  notReviewed: number;
  confirmed: number;
  overriden: number;
};

export type TStatisticPercentage = {
  notReviewed: string;
  confirmed: string;
  overriden: string;
};
