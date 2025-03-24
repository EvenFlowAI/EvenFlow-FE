import { EServiceCategoryPage } from '../../../api/types';
import { IServiceRequestShort } from '../serviceRequests/types';
import { EServiceType } from '../appointmentFrameReducer/types';

export interface ICategory {
  id: number;
  name: string;
  page: EServiceCategoryPage;
  iconPath?: string;
  serviceRequests: IServiceRequestShort[];
  type: EServiceCategoryType;
  orderIndex?: number;
  description?: string;
  isCommentRequired?: boolean;
  comment: string | null;
}

export type TCategoryServiceRequest = {
  id: number;
  orderIndex?: number;
};

export type TUpdateCategoryData = {
  name: string;
  serviceRequests?: TCategoryServiceRequest[];
  page: number;
  type: EServiceCategoryType;
  orderIndex?: number;
  description?: string;
  isCommentRequired?: boolean;
  serviceType: EServiceType;
};

export type TNewCategory = TUpdateCategoryData & {
  serviceCenterId: number;
};

export enum EServiceCategoryType {
  GeneralCategory,
  MaintenancePackage,
  IndividualServices,
  LinkToPage2,
  Diagnose,
  ValueService,
  OpenRecalls,
}

export type TSuccessCallback = (id: number) => void;

export type TState = {
  categories: ICategory[];
  allCategories: ICategory[];
  isLoading: boolean;
  page: number;
  filter: EServiceType;
};
