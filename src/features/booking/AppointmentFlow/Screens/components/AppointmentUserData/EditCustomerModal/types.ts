import { ECommunicationPhoneType, ICustomerLoadedData } from '../../../../../../../api/types';
import { IUpdateCustomerData } from '../../../../../../../store/reducers/enhancedCustomerSearch/types';
import { TPhoneCategory } from '../../../../../../../utils/communicationPhoneType';

export type TPhoneType = TPhoneCategory;
export type TPhoneValues = Record<TPhoneType, string>;

export type TEditCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  customerLoadedData: ICustomerLoadedData;
  communicationPhone: string;
  communicationPhoneType: ECommunicationPhoneType | null;
  isEmailRequired: boolean;
  onUpdated: (
    customer: IUpdateCustomerData,
    communicationPhone: string,
    communicationPhoneType: ECommunicationPhoneType
  ) => void;
};
