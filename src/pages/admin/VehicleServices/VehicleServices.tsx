import React, { useEffect } from 'react';
import { Tab } from '@mui/material';
import { TabList } from '../../../components/styled/Tabs';
import { TabContext, TabPanel } from '@mui/lab';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { ServiceRequests } from '../../../features/admin/ServiceRequests/ServiceRequests';
import { MaintenancePackages } from '../../../features/admin/MaintenancePackages/MaintenancePackages';
import { ComplimentaryServices } from '../../../features/admin/ComplimentaryServices/ComplimentaryServices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { IntervalUpsell } from '../../../features/admin/IntervallUpsell/IntervalUpsell';
import { servicesRoot } from '../../../utils/constants';
import RecallParts from '../../../features/admin/RecallsParts/RecallParts';
import { setVehicleServicesTab } from '../../../store/reducers/adminPanel/actions';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { SystemType } from '../../../store/reducers/serviceCenters/types';
import { ConfigurationRetrieval } from '../../../features/admin/ConfigurationRetrieval/ConfigurationRetrieval';

export const VehicleServices = () => {
  const { vehicleServicesTab } = useSelector((state: RootState) => state.adminPanel);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const isXtime = selectedSC?.system === SystemType.Xtime;
  const activeTab = vehicleServicesTab === '5' && !isXtime ? '0' : vehicleServicesTab;

  useEffect(() => {
    if (!isXtime && vehicleServicesTab === '5') {
      dispatch(setVehicleServicesTab('0'));
    }
  }, [dispatch, isXtime, vehicleServicesTab]);

  const handleTabChange = (e: React.SyntheticEvent, tab: string) => {
    dispatch(setVehicleServicesTab(tab));
  };

  return (
    <TabContext value={activeTab}>
      <TitleContainer title="Vehicle Services" pad parent={servicesRoot} />
      <TabList
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
      >
        <Tab label="Op Codes" value="0" />
        <Tab label="Maintenance Packages" value="1" />
        <Tab label="Complimentary Services" value="2" />
        <Tab label="Interval Upsell" value="3" />
        <Tab label="Recalls" value="4" />
        {isXtime && <Tab label="Configuration Retrieval" value="5" />}
      </TabList>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="0">
        <ServiceRequests />
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="1">
        <MaintenancePackages />
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="2">
        <ComplimentaryServices />
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="3">
        <IntervalUpsell />
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="4">
        <RecallParts />
      </TabPanel>
      {isXtime && (
        <TabPanel style={{ width: '100%', padding: '24px 0' }} value="5">
          <ConfigurationRetrieval />
        </TabPanel>
      )}
    </TabContext>
  );
};
