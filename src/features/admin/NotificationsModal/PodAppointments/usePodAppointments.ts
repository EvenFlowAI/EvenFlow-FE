import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IPodShort } from '../../../../store/reducers/pods/types';
import { loadPodsShort } from '../../../../store/reducers/pods/actions';
import { TNotifications } from '../../../../store/reducers/notifications/types';
import {
  setLoading,
  updatePodNotifications,
} from '../../../../store/reducers/notifications/actions';
import { IAdvisorShort } from '../../../../store/reducers/users/types';
import { checkPodsAreTheSame } from '../utils';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { TChangesState } from '../types';

type TProps = {
  setChangesState: React.Dispatch<React.SetStateAction<TChangesState>>;
  changesState?: TChangesState;
};

export const usePodAppointments = ({ setChangesState, changesState }: TProps) => {
  const { usersShort, loading } = useSelector((state: RootState) => state.employees);
  const { shortPodsList, podsLoading } = useSelector((state: RootState) => state.pods);
  const { podNotifications, isLoading } = useSelector((state: RootState) => state.notifications);

  const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort | null>(null);
  const [allPodData, setAllPodData] = useState<TNotifications[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
  const [selectedPod, setSelectedPod] = useState<IPodShort | null>(null);
  const [formChecked, setFormChecked] = useState(false);

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { askConfirm } = useConfirm();
  const showError = useException();
  const showMessage = useMessage();

  const currentPodData = useMemo(
    () => allPodData.find(item => item.id === selectedPod?.id),
    [allPodData, selectedPod]
  );

  useEffect(() => {
    const changesSaved = currentEmployee
      ? false
      : checkPodsAreTheSame(allPodData, podNotifications);
    setChangesState(prevState => ({ ...prevState, podNotificationsSaved: changesSaved }));
  }, [allPodData, currentEmployee, podNotifications, setChangesState]);

  useEffect(() => {
    setAllPodData(podNotifications);
  }, [podNotifications]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadPodsShort(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  useEffect(() => {
    dispatch(setLoading(true));
    if (podNotifications.length) {
      const pod = shortPodsList.find(item => item.id === podNotifications[0].id);
      if (pod) {
        setSelectedPod(pod);
      }
    }
    dispatch(setLoading(false));
  }, [dispatch, podNotifications, shortPodsList]);

  useEffect(() => {
    if (currentPodData?.usersList) {
      setSelectedEmployees(usersShort.filter(user => currentPodData.usersList?.includes(user.id)));
    }
  }, [currentPodData, usersShort]);

  const onEmployeeChange = (_e: SyntheticEvent, value: IAdvisorShort | null) => {
    setFormChecked(false);
    setCurrentEmployee(value);
  };

  const onPodChange = (_e: SyntheticEvent, value: IPodShort | null) => {
    setFormChecked(false);
    const podData = allPodData.find(item => item.id === value?.id);

    if (podData) {
      setSelectedEmployees(usersShort.filter(user => podData.usersList?.includes(user.id)));
      setSelectedPod(value);
      return;
    }

    if (value) {
      setAllPodData(prevState => [...prevState, { id: value.id, usersList: [] }]);
    } else {
      setAllPodData(prevState => prevState.filter(item => item.id !== selectedPod?.id));
    }

    setSelectedEmployees([]);
    setSelectedPod(value);
  };

  const onSuccess = () => {
    showMessage('Notifications for Service Book Appointments updated');
    setCurrentEmployee(null);
    setFormChecked(false);
  };

  const onSave = () => {
    setFormChecked(true);
    if (currentEmployee && !currentPodData?.usersList?.includes(currentEmployee.id)) {
      showError('Please add or remove Selected Employee');
      return;
    }

    if (selectedSC) {
      dispatch(updatePodNotifications(selectedSC.id, allPodData, onSuccess, showError));
    }
  };

  const onCancel = () => {
    setFormChecked(false);
    setCurrentEmployee(null);

    if (changesState?.podNotificationsSaved) {
      setAllPodData(podNotifications);
      return;
    }

    askConfirm({
      isRemove: true,
      confirmContent: 'Cancel changes',
      cancelContent: 'Save changes',
      title: 'Cancel Service Book Notifications changes',
      content:
        'By clicking Cancel, your entries across all Pods will not be saved. Click Save Changes to store your inputs.',
      onConfirm: () => setAllPodData(podNotifications),
      onCancel: onSave,
    });
  };

  const onAddEmployee = () => {
    setFormChecked(false);
    if (!currentEmployee || !selectedPod || !currentPodData) {
      return;
    }

    const updated = {
      ...currentPodData,
      usersList: currentPodData.usersList
        ? Array.from(new Set([...currentPodData.usersList, currentEmployee.id]))
        : [currentEmployee.id],
    };
    const data = allPodData.filter(item => item.id !== currentPodData.id);
    setAllPodData([...data, updated]);
    setCurrentEmployee(null);
  };

  const deleteEmployee = (id: string) => {
    setFormChecked(false);
    if (currentPodData?.usersList) {
      const updated = {
        ...currentPodData,
        usersList: currentPodData.usersList.filter(userId => userId !== id),
      };
      const data = allPodData.filter(item => item.id !== currentPodData.id);
      setAllPodData([...data, updated]);
    }
  };

  return {
    usersShort,
    loading,
    shortPodsList,
    podsLoading,
    isLoading,
    selectedEmployees,
    selectedPod,
    currentEmployee,
    formChecked,
    currentPodData,
    onEmployeeChange,
    onPodChange,
    onCancel,
    onSave,
    onAddEmployee,
    deleteEmployee,
  };
};
