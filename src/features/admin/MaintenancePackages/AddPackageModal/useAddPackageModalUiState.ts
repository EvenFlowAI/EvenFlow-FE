import { useState } from 'react';
import { useModal } from '../../../../hooks/useModal/useModal';
import { TAssignedRequest } from '../../../../store/reducers/packages/types';
import {
  IAssignedServiceRequest,
  IUpsellServiceRequest,
} from '../../../../store/reducers/serviceRequests/types';
import { IEngineType } from '../../../../store/reducers/vehicleDetails/types';
import { initialValues } from './constants';
import { IVehiclesData } from './types';

export const useAddPackageModalUiState = () => {
  const [packageName, setPackageName] = useState('');
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [opsCodes, setOpsCodes] = useState<IAssignedServiceRequest[]>([]);
  const [upsellCodes, setUpsellCodes] = useState<IUpsellServiceRequest[]>([]);
  const [assignedOpsCodes, setAssignedOpsCodes] = useState<TAssignedRequest[]>([]);
  const [complimentary, setComplimentary] = useState<number[]>([]);
  const [vehiclesData, setVehiclesData] = useState<IVehiclesData>(initialValues);
  const [formIsChecked, setFormIsChecked] = useState(false);
  const [isApplyBusinessRules, setApplyBusinessRules] = useState(false);
  const [selectedMakes, setSelectedMakes] = useState<number[]>([]);
  const [selectedModels, setSelectedModels] = useState<number[]>([]);
  const [selectedMileages, setSelectedMileages] = useState<string[]>([]);
  const [optionError, setOptionError] = useState(false);
  const [selectedEngineTypes, setSelectedEngineTypes] = useState<IEngineType[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    isOpen: isAssignOpsCodeOpen,
    onOpen: onAssignOpsCodeOpen,
    onClose: onAssignOpsCodeClose,
  } = useModal();
  const {
    isOpen: isAddOpsCodeOpen,
    onOpen: onAddOpsCodeOpen,
    onClose: onAddOpsCodeClose,
  } = useModal();
  const { isOpen: isUpsellOpen, onOpen: onUpsellOpen, onClose: onUpsellClose } = useModal();
  const {
    isOpen: isComplimentaryOpen,
    onOpen: onComplimentaryOpen,
    onClose: onComplimentaryClose,
  } = useModal();
  const { isOpen: isExistingOpen, onOpen: onExistingOpen, onClose: onExistingClose } = useModal();

  return {
    state: {
      packageName,
      selectedPackages,
      opsCodes,
      upsellCodes,
      assignedOpsCodes,
      complimentary,
      vehiclesData,
      formIsChecked,
      isApplyBusinessRules,
      selectedMakes,
      selectedModels,
      selectedMileages,
      optionError,
      selectedEngineTypes,
      isSaving,
    },
    setters: {
      setPackageName,
      setSelectedPackages,
      setOpsCodes,
      setUpsellCodes,
      setAssignedOpsCodes,
      setComplimentary,
      setVehiclesData,
      setFormIsChecked,
      setApplyBusinessRules,
      setSelectedMakes,
      setSelectedModels,
      setSelectedMileages,
      setOptionError,
      setSelectedEngineTypes,
      setIsSaving,
    },
    modals: {
      isAssignOpsCodeOpen,
      onAssignOpsCodeOpen,
      onAssignOpsCodeClose,
      isAddOpsCodeOpen,
      onAddOpsCodeOpen,
      onAddOpsCodeClose,
      isUpsellOpen,
      onUpsellOpen,
      onUpsellClose,
      isComplimentaryOpen,
      onComplimentaryOpen,
      onComplimentaryClose,
      isExistingOpen,
      onExistingOpen,
      onExistingClose,
    },
  };
};
