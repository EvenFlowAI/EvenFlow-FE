import { useAddPackageModalData } from './useAddPackageModalData';
import { useAddPackageModalFormHandlers } from './useAddPackageModalFormHandlers';
import { useAddPackageModalPrefill } from './useAddPackageModalPrefill';
import { useAddPackageModalSave } from './useAddPackageModalSave';
import { useAddPackageModalUiState } from './useAddPackageModalUiState';

type TProps = {
  isEditing?: boolean;
  onClose: () => void;
};

export const useAddPackageModal = ({ isEditing, onClose }: TProps) => {
  const { state, setters, modals } = useAddPackageModalUiState();
  const {
    packages,
    currentPackage,
    isPackageLoading,
    allAssignedList,
    intervalUpsellList,
    engineTypes,
    selectedSC,
  } = useAddPackageModalData(isEditing);

  const resetPrefill = useAddPackageModalPrefill({
    isEditing,
    currentPackage,
    allAssignedList,
    intervalUpsellList,
    engineTypes,
    setters,
  });
  const formHandlers = useAddPackageModalFormHandlers({ onClose, resetPrefill, setters });
  const onSave = useAddPackageModalSave({
    isEditing,
    onCancel: formHandlers.onCancel,
    state,
    setters,
    packages,
    currentPackage,
    selectedSC,
  });

  return {
    data: { ...state, packages, isPackageLoading },
    modals,
    setters: {
      setSelectedPackages: setters.setSelectedPackages,
      setAssignedOpsCodes: setters.setAssignedOpsCodes,
      setComplimentary: setters.setComplimentary,
      setSelectedMakes: setters.setSelectedMakes,
      setSelectedModels: setters.setSelectedModels,
      setFormIsChecked: setters.setFormIsChecked,
      setSelectedMileages: setters.setSelectedMileages,
      setOptionError: setters.setOptionError,
      setSelectedEngineTypes: setters.setSelectedEngineTypes,
    },
    handlers: { ...formHandlers, onSave },
  };
};
