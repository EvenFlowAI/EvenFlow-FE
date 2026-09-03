import { ChangeEvent, SyntheticEvent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ECustomerCriteria, IPackageByQuery } from '../../../../api/types';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import {
  createPackage,
  loadMakes,
  updatePackage,
} from '../../../../store/reducers/packages/actions';
import {
  loadAllAssignedServiceRequests,
  loadUpsellServiceRequests,
} from '../../../../store/reducers/serviceRequests/actions';
import {
  IAssignedServiceRequest,
  IServiceRequest,
  IUpsellServiceRequest,
} from '../../../../store/reducers/serviceRequests/types';
import { loadEngineType, loadMileage } from '../../../../store/reducers/vehicleDetails/actions';
import { RootState } from '../../../../store/rootReducer';
import { initialValues } from './constants';
import { IVehiclesData } from './types';
import {
  buildPackagePayload,
  getRequestsFromSelectedPackages,
  validateBusinessRules,
} from './saveHelpers';
import { useAddPackageModalUiState } from './useAddPackageModalUiState';

type TProps = {
  isEditing?: boolean;
  onClose: () => void;
};

export const useAddPackageModal = ({ isEditing, onClose }: TProps) => {
  const { packages, currentPackage, isPackageLoading } = useSelector(
    (state: RootState) => state.packages
  );
  const { allAssignedList, intervalUpsellList } = useSelector(
    (state: RootState) => state.serviceRequests
  );
  const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
  const { selectedSC } = useSCs();

  const ui = useAddPackageModalUiState();
  const { state, setters, modals } = ui;

  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    if (!selectedSC) return;
    dispatch(loadMakes(selectedSC.id));
    dispatch(loadMileage(selectedSC.id));
    dispatch(loadEngineType(selectedSC.id));
    if (isEditing) dispatch(loadAllAssignedServiceRequests(selectedSC.id));
    dispatch(loadUpsellServiceRequests(selectedSC.id));
  }, [dispatch, isEditing, selectedSC]);

  useEffect(() => {
    if (!isEditing || !currentPackage) return;

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

  const onCancel = useCallback(() => {
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
  }, [onClose, setters]);

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setters.setFormIsChecked(false);
      setters.setPackageName(e.target.value);
    },
    [setters]
  );

  const onFormFieldChange = useCallback(
    (fieldName: keyof IVehiclesData) =>
      (_e: SyntheticEvent, value: string[] | string | null): void => {
        setters.setFormIsChecked(false);
        if (fieldName === 'customerCriteria') {
          setters.setVehiclesData(prevData => ({
            ...prevData,
            // @ts-ignore existing enum mapping behavior
            [fieldName]: ECustomerCriteria[value],
          }));
          return;
        }
        setters.setVehiclesData(prevData => ({ ...prevData, [fieldName]: value }));
      },
    [setters]
  );

  const onDelete = useCallback(
    (serviceRequest: IServiceRequest) => {
      setters.setFormIsChecked(false);
      setters.setOpsCodes(prev =>
        prev.filter(item => serviceRequest.id !== item.serviceRequest.id)
      );
    },
    [setters]
  );

  const onPackageDelete = useCallback(
    (pack: IPackageByQuery) => {
      setters.setFormIsChecked(false);
      setters.setSelectedPackages(prev =>
        prev.includes(pack.id) ? prev.filter(item => item !== pack.id) : [...prev, pack.id]
      );
    },
    [setters]
  );

  const onApplyBusinessRulesChange = (e: ChangeEvent<HTMLInputElement>) =>
    setters.setApplyBusinessRules(e.target.checked);

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

  const onSave = () => {
    if (!isValid()) {
      setters.setFormIsChecked(true);
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
      dispatch(updatePackage(currentPackage.id, data, selectedSC.id, onSuccess, e => showError(e)));
      return;
    }

    dispatch(createPackage(selectedSC.id, data, onSuccess, e => showError(e)));
  };

  const handleOpsCodeSelect = useCallback(
    (item: IAssignedServiceRequest) => {
      setters.setOpsCodes(prev =>
        prev.find(current => current.id === item.id)
          ? prev.filter(current => current.id !== item.id)
          : [...prev, item]
      );
    },
    [setters]
  );

  const handleUpsellCodeSelect = useCallback(
    (item: IUpsellServiceRequest) => {
      setters.setUpsellCodes(prev =>
        prev.find(current => current.id === item.id)
          ? prev.filter(current => current.id !== item.id)
          : [...prev, item]
      );
    },
    [setters]
  );

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
    handlers: {
      onCancel,
      onSave,
      onNameChange,
      onFormFieldChange,
      onDelete,
      onPackageDelete,
      onApplyBusinessRulesChange,
      handleOpsCodeSelect,
      handleUpsellCodeSelect,
    },
  };
};
