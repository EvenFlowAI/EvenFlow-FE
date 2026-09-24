import { useDispatch } from 'react-redux';
import { useException } from '../../../../hooks/useException/useException';
import { createPackage, updatePackage } from '../../../../store/reducers/packages/actions';
import { RootState } from '../../../../store/rootReducer';
import {
  buildPackagePayload,
  getRequestsFromSelectedPackages,
  validateBusinessRules,
} from './saveHelpers';
import { useAddPackageModalUiState } from './useAddPackageModalUiState';

type TUi = ReturnType<typeof useAddPackageModalUiState>;

type TArgs = {
  isEditing?: boolean;
  onCancel: () => void;
  state: TUi['state'];
  setters: TUi['setters'];
  packages: RootState['packages']['packages'];
  currentPackage: RootState['packages']['currentPackage'];
  selectedSC: RootState['serviceCenters']['selectedSC'];
};

export const useAddPackageModalSave = ({
  isEditing,
  onCancel,
  state,
  setters,
  packages,
  currentPackage,
  selectedSC,
}: TArgs) => {
  const dispatch = useDispatch();
  const showError = useException(true);

  const isValid = () => {
    const hasMainData = state.packageName && state.opsCodes.length && state.assignedOpsCodes.length;
    const businessRulesValid = state.isApplyBusinessRules
      ? validateBusinessRules({
          vehiclesData: state.vehiclesData,
          selectedModels: state.selectedModels,
          selectedMakes: state.selectedMakes,
          selectedMileages: state.selectedMileages,
          selectedEngineTypes: state.selectedEngineTypes,
          showError,
        })
      : true;

    return Boolean(hasMainData && businessRulesValid);
  };

  return () => {
    if (!isValid()) {
      setters.setFormIsChecked(true);
      if (!state.packageName.length || !state.opsCodes.length || !state.assignedOpsCodes.length) {
        showError('Please fill in all required fields');
      }
      return;
    }
    if (!selectedSC) return;

    setters.setIsSaving(true);
    const serviceRequests = getRequestsFromSelectedPackages(
      state.selectedPackages,
      state.opsCodes,
      packages
    );
    const data = buildPackagePayload({
      packageName: state.packageName,
      serviceCenterId: selectedSC.id,
      serviceRequests,
      complimentary: state.complimentary,
      assignedOpsCodes: state.assignedOpsCodes,
      isApplyBusinessRules: state.isApplyBusinessRules,
      selectedEngineTypes: state.selectedEngineTypes,
      upsellCodes: state.upsellCodes,
      selectedMakes: state.selectedMakes,
      selectedModels: state.selectedModels,
      vehiclesData: state.vehiclesData,
      selectedMileages: state.selectedMileages,
      isEditing,
      currentBusinessRules: currentPackage?.businessRules,
    });

    const onSuccess = () => {
      onCancel();
      setters.setIsSaving(false);
    };

    if (isEditing && currentPackage) {
      dispatch(
        updatePackage(currentPackage.id, data, selectedSC.id, onSuccess, error => {
          showError(error);
          setters.setIsSaving(false);
        })
      );
      return;
    }

    dispatch(
      createPackage(selectedSC.id, data, onSuccess, error => {
        showError(error);
        setters.setIsSaving(false);
      })
    );
  };
};
