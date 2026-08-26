import { useCallback } from 'react';
import { IPackageById, IPackageOptionDetailed } from '../../../../api/types';
import { TCellData } from '../types';
import { updatePackageOption } from './packageAccordion.helpers';

type TProps = {
  setPackageData: React.Dispatch<React.SetStateAction<IPackageById | null>>;
  showError: (message: string) => void;
};

export const usePackageOptionToggles = ({ setPackageData, showError }: TProps) => {
  const onComplimentaryClick = useCallback(
    (item: TCellData, requestId: number) => {
      setPackageData(prev => {
        if (!prev) return prev;
        return updatePackageOption(prev, item.optionType, option => ({
          ...option,
          complimentaryServices: option.complimentaryServices.includes(requestId)
            ? option.complimentaryServices.filter(request => request !== requestId)
            : [...option.complimentaryServices, requestId],
        }));
      });
    },
    [setPackageData]
  );

  const onCheckboxClick = useCallback(
    (item: TCellData, requestId: number) => {
      setPackageData(prev => {
        if (!prev) return prev;
        return updatePackageOption(prev, item.optionType, option => ({
          ...option,
          serviceRequests: option.serviceRequests.find(
            request => request.serviceRequestId === requestId
          )
            ? option.serviceRequests.filter(request => request.serviceRequestId !== requestId)
            : [...option.serviceRequests, { serviceRequestId: requestId, isSendToDMS: true }],
        }));
      });
    },
    [setPackageData]
  );

  const onUpsellClick = useCallback(
    (item: TCellData, requestId: number) => {
      setPackageData(prev => {
        if (!prev) return prev;
        return updatePackageOption(prev, item.optionType, option => ({
          ...option,
          intervalUpsells: option.intervalUpsells.find(
            request => request.serviceRequestId === requestId
          )
            ? option.intervalUpsells.filter(request => request.serviceRequestId !== requestId)
            : [...option.intervalUpsells, { serviceRequestId: requestId, isSendToDMS: true }],
        }));
      });
    },
    [setPackageData]
  );

  const onInputChange = useCallback(
    (value: string, fieldName: string, optionType: string | number) => {
      if (fieldName.toLowerCase().includes('hours') && Number(value) > 100) {
        showError('Invoiced Labor Hours must be no more than 100');
        return;
      }

      setPackageData(prev => {
        if (!prev) return prev;
        return updatePackageOption(prev, +optionType, option => ({
          ...option,
          [fieldName as keyof IPackageOptionDetailed]: +value,
        }));
      });
    },
    [setPackageData, showError]
  );

  return {
    onComplimentaryClick,
    onCheckboxClick,
    onUpsellClick,
    onInputChange,
  };
};
