import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { loadMakes } from '../../../../store/reducers/packages/actions';
import {
  loadAllAssignedServiceRequests,
  loadUpsellServiceRequests,
} from '../../../../store/reducers/serviceRequests/actions';
import { loadEngineType, loadMileage } from '../../../../store/reducers/vehicleDetails/actions';
import { RootState } from '../../../../store/rootReducer';

export const useAddPackageModalData = (isEditing?: boolean) => {
  const { packages, currentPackage, isPackageLoading } = useSelector(
    (state: RootState) => state.packages
  );
  const { allAssignedList, intervalUpsellList } = useSelector(
    (state: RootState) => state.serviceRequests
  );
  const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedSC) return;
    dispatch(loadMakes(selectedSC.id));
    dispatch(loadMileage(selectedSC.id));
    dispatch(loadEngineType(selectedSC.id));
    if (isEditing) dispatch(loadAllAssignedServiceRequests(selectedSC.id));
    dispatch(loadUpsellServiceRequests(selectedSC.id));
  }, [dispatch, isEditing, selectedSC]);

  return {
    packages,
    currentPackage,
    isPackageLoading,
    allAssignedList,
    intervalUpsellList,
    engineTypes,
    selectedSC,
  };
};
