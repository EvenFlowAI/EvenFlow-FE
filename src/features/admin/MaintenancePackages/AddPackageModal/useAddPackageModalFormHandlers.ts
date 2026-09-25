import { ChangeEvent, SyntheticEvent, useCallback } from 'react';
import { ECustomerCriteria, IPackageByQuery } from '../../../../api/types';
import {
  IAssignedServiceRequest,
  IServiceRequest,
  IUpsellServiceRequest,
} from '../../../../store/reducers/serviceRequests/types';
import { initialValues } from './constants';
import { IVehiclesData } from './types';
import { useAddPackageModalUiState } from './useAddPackageModalUiState';

type TSetters = ReturnType<typeof useAddPackageModalUiState>['setters'];

type TArgs = {
  onClose: () => void;
  resetPrefill: () => void;
  setters: TSetters;
};

export const useAddPackageModalFormHandlers = ({ onClose, resetPrefill, setters }: TArgs) => {
  const onCancel = useCallback(() => {
    resetPrefill();
    setters.setFormIsChecked(false);
    setters.setVehiclesData(initialValues);
    setters.setPackageName('');
    setters.setSelectedPackages([]);
    setters.setAssignedOpsCodes([]);
    setters.setComplimentary([]);
    setters.setOpsCodes([]);
    setters.setSelectedModels([]);
    setters.setSelectedMakes([]);
    setters.setApplyBusinessRules(false);
    setters.setSelectedMileages([]);
    setters.setSelectedEngineTypes([]);
    setters.setUpsellCodes([]);
    onClose();
  }, [onClose, resetPrefill, setters]);

  const onNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setters.setFormIsChecked(false);
      setters.setPackageName(event.target.value);
    },
    [setters]
  );

  const onFormFieldChange = useCallback(
    (fieldName: keyof IVehiclesData) =>
      (_event: SyntheticEvent, value: string[] | string | null): void => {
        setters.setFormIsChecked(false);
        if (fieldName === 'customerCriteria') {
          setters.setVehiclesData(previousData => ({
            ...previousData,
            // @ts-ignore existing enum mapping behavior
            [fieldName]: ECustomerCriteria[value],
          }));
          return;
        }
        setters.setVehiclesData(previousData => ({ ...previousData, [fieldName]: value }));
      },
    [setters]
  );

  const onDelete = useCallback(
    (serviceRequest: IServiceRequest) => {
      setters.setFormIsChecked(false);
      setters.setOpsCodes(previous =>
        previous.filter(item => serviceRequest.id !== item.serviceRequest.id)
      );
    },
    [setters]
  );

  const onPackageDelete = useCallback(
    (pack: IPackageByQuery) => {
      setters.setFormIsChecked(false);
      setters.setSelectedPackages(previous =>
        previous.includes(pack.id)
          ? previous.filter(item => item !== pack.id)
          : [...previous, pack.id]
      );
    },
    [setters]
  );

  const onApplyBusinessRulesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setters.setApplyBusinessRules(event.target.checked),
    [setters]
  );

  const handleOpsCodeSelect = useCallback(
    (item: IAssignedServiceRequest) => {
      setters.setOpsCodes(previous =>
        previous.find(current => current.id === item.id)
          ? previous.filter(current => current.id !== item.id)
          : [...previous, item]
      );
    },
    [setters]
  );

  const handleUpsellCodeSelect = useCallback(
    (item: IUpsellServiceRequest) => {
      setters.setUpsellCodes(previous =>
        previous.find(current => current.id === item.id)
          ? previous.filter(current => current.id !== item.id)
          : [...previous, item]
      );
    },
    [setters]
  );

  return {
    onCancel,
    onNameChange,
    onFormFieldChange,
    onDelete,
    onPackageDelete,
    onApplyBusinessRulesChange,
    handleOpsCodeSelect,
    handleUpsellCodeSelect,
  };
};
