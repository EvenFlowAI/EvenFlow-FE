import {
  IAssignedServiceRequest,
  TOPsCodeWithIndex,
} from '../../../../store/reducers/serviceRequests/types';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';

export interface IIconState {
  file: File | null;
  dataUrl?: string;
}

export type TOption = {
  value: number;
  name: string;
};

export enum EOrderError {
  MissingNumber,
  SameNumber,
}

const initialFileState = { file: null, dataUrl: undefined };

export type CategoryFormState = {
  fileState: IIconState;
  categoryName: string;
  definedPage: TOption | null;
  categoryType: TOption | null;
  formIsChecked: boolean;
  selectedCodes: IAssignedServiceRequest[];
  selectedCodesWithOrder: TOPsCodeWithIndex[];
  orderIndex: string;
  description: string;
  selectedServiceType: EServiceType;
  isCommentRequired: boolean;
  wrongOrderIndexes: number[];
};

export const initialFormState: CategoryFormState = {
  fileState: initialFileState,
  categoryName: '',
  definedPage: null,
  categoryType: null,
  formIsChecked: false,
  selectedCodes: [],
  selectedCodesWithOrder: [],
  orderIndex: '',
  description: '',
  selectedServiceType: EServiceType.VisitCenter,
  isCommentRequired: false,
  wrongOrderIndexes: [],
};
