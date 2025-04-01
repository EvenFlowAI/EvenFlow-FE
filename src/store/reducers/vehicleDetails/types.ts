import { IMake, IMakeExtended } from '../../../api/types';
import { IPagingResponse, IOrder, IPageRequest } from '../../../types/types';
import { IGlobalMake, IGlobalModel } from '../globalVehicles/types';
export interface ICreateMake {
  serviceCenterId: number;
  globalIds: number[];
}

export interface IMileage {
  id: number;
  value: number;
}

export interface IEngineType {
  id: number;
  name: string;
}

export type TCreateMileage = {
  values: number[];
  serviceCenterId: number;
  podId?: number;
};

export type TCreateEngineType = {
  names: string[];
  serviceCenterId: number;
  podId?: number;
};

export type TState = {
  makes: IMake[];
  allMakes: IMake[];
  currentMake: IMake | null;
  isLoading: boolean;
  mileage: IMileage[];
  makesModels: IMakeExtended[];
  engineTypes: IEngineType[];
  paging: IPagingResponse;
  order: IOrder<IMake>;
  pageData: IPageRequest;
  globalMakes: IGlobalMake[];
  globalModels: IGlobalModel[];
};
