import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { TTransportationNotifications } from '../../../../store/reducers/notifications/types';
import {
  setLoading,
  updateTransportationNotifications,
} from '../../../../store/reducers/notifications/actions';
import { IAdvisorShort } from '../../../../store/reducers/users/types';
import { loadTransportationOptions } from '../../../../store/reducers/transportationNeeds/actions';
import { ITransportationOptionFull } from '../../../../store/reducers/transportationNeeds/types';
import { useNotificationStyles } from '../../../../hooks/styling/useNotificationStyles';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { initialTransportationNotifications } from '../constants';
import { TChangesState } from '../types';
import { checkTransportationAreTheSame } from '../utils';

type TProps = {
  setChangesState: React.Dispatch<React.SetStateAction<TChangesState>>;
  changesState?: TChangesState;
};

export const useTransportations = ({ setChangesState, changesState }: TProps) => {
  const { usersShort, loading } = useSelector((state: RootState) => state.employees);
  const { options, isLoading } = useSelector((state: RootState) => state.transportation);
  const { transportationNotifications, isLoading: isSaving } = useSelector(
    (state: RootState) => state.notifications
  );

  const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort | null>(null);
  const [allTransportationData, setAllTransportationData] =
    useState<TTransportationNotifications | null>(initialTransportationNotifications);
  const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
  const [formChecked, setFormChecked] = useState(false);
  const [selectedTransportation, setSelectedTransportation] =
    useState<ITransportationOptionFull | null>(null);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { askConfirm } = useConfirm();
  const showError = useException();
  const showMessage = useMessage();
  const { classes } = useNotificationStyles();
  const currentTransportationData = useMemo(
    () =>
      allTransportationData?.transportationOptions?.find(
        item => item.id === selectedTransportation?.id
      ),
    [allTransportationData, selectedTransportation]
  );
  const inactiveOptionsIds = useMemo(
    () => options.filter(option => option.state === 0).map(item => item.id),
    [options]
  );
  const activeOptionsNotifications = useMemo(() => {
    if (!transportationNotifications?.transportationOptions) {
      return [];
    }
    return transportationNotifications.transportationOptions.filter(
      item => !inactiveOptionsIds.includes(item.id)
    );
  }, [transportationNotifications, inactiveOptionsIds]);
  useEffect(() => {
    let changesSaved = true;
    if (currentEmployee) {
      changesSaved = false;
    } else if (allTransportationData && transportationNotifications) {
      changesSaved =
        allTransportationData.isActive === transportationNotifications.isActive &&
        checkTransportationAreTheSame(
          allTransportationData.transportationOptions,
          activeOptionsNotifications
        );
    } else if (
      (allTransportationData && !transportationNotifications) ||
      (!allTransportationData && transportationNotifications)
    ) {
      changesSaved = false;
    }
    setChangesState(prevState => ({
      ...prevState,
      transportationNotificationsSaved: changesSaved,
    }));
  }, [
    activeOptionsNotifications,
    allTransportationData,
    currentEmployee,
    setChangesState,
    transportationNotifications,
  ]);
  useEffect(() => {
    if (selectedSC) {
      dispatch(loadTransportationOptions(selectedSC.id));
    }
  }, [dispatch, selectedSC]);
  const setInitialTransportation = useCallback(() => {
    dispatch(setLoading(true));
    if (activeOptionsNotifications.length) {
      const option = options.find(item => item.id === activeOptionsNotifications[0].id);
      if (option) {
        setSelectedTransportation(option);
      }
    }
    dispatch(setLoading(false));
  }, [activeOptionsNotifications, dispatch, options]);
  const setInitialEmployees = useCallback(() => {
    if (currentTransportationData?.usersList) {
      setSelectedEmployees(
        usersShort.filter(user => currentTransportationData.usersList?.includes(user.id))
      );
    }
  }, [currentTransportationData, usersShort]);
  const setInitialData = useCallback(() => {
    if (transportationNotifications?.transportationOptions) {
      setAllTransportationData({
        isActive: transportationNotifications.isActive,
        transportationOptions: activeOptionsNotifications,
      });
      return;
    }
    setAllTransportationData(transportationNotifications);
  }, [activeOptionsNotifications, transportationNotifications]);
  useEffect(() => {
    setInitialTransportation();
  }, [setInitialTransportation]);

  useEffect(() => {
    setInitialEmployees();
  }, [setInitialEmployees]);

  useEffect(() => {
    setInitialData();
  }, [setInitialData]);
  const onEmployeeChange = (_e: SyntheticEvent, value: IAdvisorShort | null) => {
    setFormChecked(false);
    setCurrentEmployee(value);
  };

  const onTransportationChange = (_e: SyntheticEvent, value: ITransportationOptionFull | null) => {
    setFormChecked(false);
    const transportationData = allTransportationData?.transportationOptions.find(
      item => item.id === value?.id
    );
    if (transportationData) {
      setSelectedEmployees(
        usersShort.filter(user => transportationData.usersList?.includes(user.id))
      );
    } else {
      if (value) {
        setAllTransportationData(prev =>
          prev
            ? {
                ...prev,
                transportationOptions: [
                  ...prev.transportationOptions,
                  { id: value.id, usersList: [] },
                ],
              }
            : prev
        );
      } else {
        setSelectedTransportation(null);
      }
      setSelectedEmployees([]);
    }
    setSelectedTransportation(value);
  };
  const clearData = () => {
    setInitialData();
    setInitialEmployees();
    setInitialTransportation();
  };
  const onSuccess = () => {
    showMessage('Notifications for TransportationOptions updated');
    setCurrentEmployee(null);
    setFormChecked(false);
  };
  const sendRequest = () => {
    if (!allTransportationData || !selectedSC) {
      return;
    }
    const data: TTransportationNotifications = {
      ...allTransportationData,
      transportationOptions: allTransportationData.transportationOptions.filter(
        item => !inactiveOptionsIds.includes(item.id)
      ),
    };
    dispatch(updateTransportationNotifications(selectedSC.id, data, onSuccess, showError));
  };
  const onSave = () => {
    setFormChecked(true);
    if (currentEmployee && !currentTransportationData?.usersList?.includes(currentEmployee.id)) {
      showError('Please add or remove Selected Employee');
      return;
    }
    sendRequest();
  };
  const onCancel = () => {
    setFormChecked(false);
    setCurrentEmployee(null);
    if (changesState?.transportationNotificationsSaved) {
      clearData();
      return;
    }
    askConfirm({
      isRemove: true,
      confirmContent: 'Cancel changes',
      cancelContent: 'Save changes',
      title: 'Cancel Transportation Notifications changes',
      content:
        'By clicking Cancel, your entries across all Transportations will not be saved. Click Save Changes to store your inputs.',
      onConfirm: clearData,
      onCancel: onSave,
    });
  };
  const onAddEmployee = () => {
    setFormChecked(false);
    if (!currentEmployee || !selectedTransportation || !currentTransportationData) {
      return;
    }
    const updated = {
      ...currentTransportationData,
      usersList: currentTransportationData.usersList
        ? Array.from(new Set([...currentTransportationData.usersList, currentEmployee.id]))
        : [currentEmployee.id],
    };
    const data = allTransportationData?.transportationOptions.filter(
      item => item.id !== currentTransportationData.id
    );
    if (data) {
      setAllTransportationData(prev =>
        prev ? { ...prev, transportationOptions: [...data, updated] } : prev
      );
    }
    setCurrentEmployee(null);
  };
  const handleSwitch = () => {
    setFormChecked(false);
    setAllTransportationData(prev => (prev ? { ...prev, isActive: !prev.isActive } : prev));
  };

  const deleteEmployee = (id: string) => {
    setFormChecked(false);
    if (!currentTransportationData?.usersList) {
      return;
    }

    const updated = {
      ...currentTransportationData,
      usersList: currentTransportationData.usersList.filter(userId => userId !== id),
    };
    const data = allTransportationData?.transportationOptions.filter(
      item => item.id !== currentTransportationData.id
    );
    if (data) {
      setAllTransportationData(prev =>
        prev ? { ...prev, transportationOptions: [...data, updated] } : prev
      );
    }
  };
  return {
    classes,
    usersShort,
    options,
    loading,
    isLoading,
    isSaving,
    selectedEmployees,
    selectedTransportation,
    currentEmployee,
    formChecked,
    allTransportationData,
    currentTransportationData,
    onEmployeeChange,
    onTransportationChange,
    onAddEmployee,
    deleteEmployee,
    handleSwitch,
    onCancel,
    onSave,
  };
};
