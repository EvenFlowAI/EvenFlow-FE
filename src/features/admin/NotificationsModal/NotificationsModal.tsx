import React, { useEffect, useState } from 'react';
import { DialogProps } from '../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { TabList } from '../../../components/styled/Tabs';
import { Tab } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useDispatch } from 'react-redux';
import ServiceCenterAppointments from './ServiceCenterAppointments/ServiceCenterAppointments';
import PodAppointments from './PodAppointments/PodAppointments';
import RecallAppointments from './RecallAppointments/RecallAppointments';
import { loadUsersShort } from '../../../store/reducers/employees/actions';
import { loadNotifications } from '../../../store/reducers/notifications/actions';
import Transportations from './Transportations/Transportations';
import { TChangesState } from './types';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';

const NotificationsModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps>>
> = props => {
  const [currentTab, setCurrentTab] = useState<string>('0');
  const [changesState, setChangesState] = useState<TChangesState>({
    scNotificationsSaved: true,
    podNotificationsSaved: true,
    recallNotificationsSaved: true,
    transportationNotificationsSaved: true,
  });
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadUsersShort(selectedSC.id));
      dispatch(loadNotifications(selectedSC.id));
    }
  }, [selectedSC]);

  const onClose = () => {
    if (Object.values(changesState).some(value => !value)) {
      showError('Please save your entries before closing the service center notifications window.');
    } else {
      props.onClose();
    }
  };

  const checkIfChangesSaved = (tab: string): boolean => {
    switch (tab) {
      case '0':
        return changesState.scNotificationsSaved;
      case '1':
        return changesState.podNotificationsSaved;
      case '2':
        return changesState.recallNotificationsSaved;
      case '3':
        return changesState.transportationNotificationsSaved;
      default:
        return true;
    }
  };

  const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
    if (checkIfChangesSaved(currentTab)) {
      setCurrentTab(tab);
    } else {
      showError('Please save your entries before switching to a different notification tab.');
    }
  };

  return (
    <BaseModal {...props} width={1150} onClose={onClose}>
      <DialogTitle
        onClose={onClose}
        style={{ textTransform: 'uppercase', color: '#252525', padding: '24px 0' }}
      >
        Manage service center notifications
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <TabContext value={currentTab}>
          <TabList
            style={{ width: '100%', margin: 0, padding: 0 }}
            onChange={handleTabChange}
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="Service Center Appointments" value="0" />
            <Tab label="Service Book Appointments" value="1" />
            <Tab label="Recall Appointments" value="2" />
            <Tab label="Transportation Requests" value="3" />
          </TabList>
          <TabPanel style={{ width: '100%', padding: '24px 0' }} value="0">
            <ServiceCenterAppointments setChangesState={setChangesState} onClose={onClose} />
          </TabPanel>
          <TabPanel style={{ width: '100%', padding: '24px 0' }} value="1">
            <PodAppointments
              setChangesState={setChangesState}
              changesState={changesState}
              onClose={onClose}
            />
          </TabPanel>
          <TabPanel style={{ width: '100%', padding: '24px 0' }} value="2">
            <RecallAppointments setChangesState={setChangesState} onClose={onClose} />
          </TabPanel>
          <TabPanel style={{ width: '100%', padding: '24px 0' }} value="3">
            <Transportations
              setChangesState={setChangesState}
              changesState={changesState}
              onClose={onClose}
            />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </BaseModal>
  );
};

export default NotificationsModal;
