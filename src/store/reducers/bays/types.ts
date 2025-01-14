import { IPageRequest, IPagingResponse } from '../../../types/types';

export interface IBayForm {
  serviceCenterId: number;
  name: string;
  alignmentEquipment: boolean;
  carryingCapacity: boolean;
  onlyQuickService: boolean;
}

export interface IBay extends IBayForm {
  id: number;
  podId?: number;
}

export interface IBayShort {
  id: number;
  name: string;
  podId?: number;
}

export type TState = {
  allBays: IBay[];
  allLoading: boolean;
  allPaging: IPagingResponse;
  saving: boolean;
  loading: boolean;
  paging: IPagingResponse;
  pageData: IPageRequest;
  bays: IBay[];
  baysShort: IBayShort[];
};
