import { DialogProps } from '../../../components/modals/BaseModal/types';
import { ITransportation } from '../../../api/types';
import { TCallback } from '../../../types/types';
import { IFirstScreenOption } from '../../../store/reducers/serviceTypes/types';

export type TSwitchFlowModalProps = DialogProps & {
  selectedOption: IFirstScreenOption | null;
  lastTransportation?: ITransportation | null;
  resetLastTransportation?: TCallback;
  onNext?: TCallback;
};
