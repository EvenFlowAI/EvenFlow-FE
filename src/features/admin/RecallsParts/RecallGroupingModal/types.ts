import { IRecall, IRecallPartGroupItem, TIdName } from '../../../../store/reducers/recall/types';
import { DialogProps } from '../../../../components/modals/BaseModal/types';

export type TGroupingGroup = {
  /** Stable client-side key, used for drag & drop ids and React keys */
  key: string;
  /** Backend group id; absent for groups created on the client */
  groupId?: number;
  recallComponent: string;
  serviceRequest: TIdName | null;
  items: IRecallPartGroupItem[];
};

export type TSplitOptions = {
  byModel: boolean;
  byYear: boolean;
};

export enum ERegroupMode {
  UseFirstGroup = 'useFirstGroup',
  ResetToDefault = 'resetToDefault',
}

export enum EGroupingPanel {
  None = 'none',
  Split = 'split',
  Regroup = 'regroup',
}

export type TRecallGroupingModalProps = DialogProps & {
  recall: IRecall | null;
};
