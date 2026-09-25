import { useCallback, useEffect, useRef } from 'react';
import { RootState } from '../../../../store/rootReducer';
import { useAddPackageModalUiState } from './useAddPackageModalUiState';

type TSetters = ReturnType<typeof useAddPackageModalUiState>['setters'];

type TArgs = {
  isEditing?: boolean;
  currentPackage: RootState['packages']['currentPackage'];
  allAssignedList: RootState['serviceRequests']['allAssignedList'];
  intervalUpsellList: RootState['serviceRequests']['intervalUpsellList'];
  engineTypes: RootState['vehicleDetails']['engineTypes'];
  setters: TSetters;
};

export const useAddPackageModalPrefill = ({
  isEditing,
  currentPackage,
  allAssignedList,
  intervalUpsellList,
  engineTypes,
  setters,
}: TArgs) => {
  const prefilledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isEditing || !currentPackage) {
      prefilledKeyRef.current = null;
      return;
    }

    // Prefill only when the edited package changes or the source lists finish loading.
    // Without this guard the effect re-ran on every render and reset user selections.
    const prefillKey = [
      currentPackage.id,
      allAssignedList?.length ?? 0,
      intervalUpsellList?.length ?? 0,
      engineTypes?.length ?? 0,
    ].join('|');

    if (prefilledKeyRef.current === prefillKey) return;
    prefilledKeyRef.current = prefillKey;

    setters.setPackageName(currentPackage.name);
    setters.setComplimentary(currentPackage.complimentaryServices.map(item => item.id));
    setters.setAssignedOpsCodes(currentPackage.serviceRequestsAssigned);
    setters.setApplyBusinessRules(currentPackage.isApplyBusinessRules);

    const selectedUpsells = currentPackage.intervalUpsells.map(item => item.id);
    setters.setUpsellCodes(intervalUpsellList.filter(item => selectedUpsells.includes(item.id)));

    if (allAssignedList) {
      const selectedRequests = currentPackage.serviceRequests.map(item => item.id);
      setters.setOpsCodes(allAssignedList.filter(item => selectedRequests.includes(item.id)));
    }

    if (currentPackage.businessRules) {
      setters.setSelectedMakes(currentPackage.businessRules.vehicleMakes ?? []);
      setters.setSelectedModels(currentPackage.businessRules.vehicleModels ?? []);
      setters.setSelectedMileages(
        currentPackage.businessRules.vehicleMileageValues.map(item => item.toString())
      );
      setters.setVehiclesData({
        yearFrom:
          currentPackage.businessRules.vehicleYearRange?.from > 0
            ? currentPackage.businessRules.vehicleYearRange.from.toString()
            : '',
        yearTo:
          currentPackage.businessRules.vehicleYearRange?.to > 0
            ? currentPackage.businessRules.vehicleYearRange.to.toString()
            : '',
        customerCriteria: currentPackage.businessRules.customerCriteria,
        isApplyBusinessRules: currentPackage.isApplyBusinessRules,
      });
    }

    if (currentPackage.engineTypes) {
      const selectedEngines = engineTypes.filter(item =>
        currentPackage.engineTypes?.find(engine => engine.id === item.id)
      );
      setters.setSelectedEngineTypes(selectedEngines);
    }
  }, [allAssignedList, currentPackage, engineTypes, intervalUpsellList, isEditing, setters]);

  return useCallback(() => {
    prefilledKeyRef.current = null;
  }, []);
};
