import React, { useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { capacityManagementRoot, demandManagementRoot } from '../../../utils/constants';
import { TabList } from '../../../components/styled/Tabs';
import { Tab } from '@mui/material';
import DemandPrediction from '../../../features/admin/DemandPrediction/DemandPrediction';
import RoPredictionParameters from '../../../features/admin/RoPredictionParameters/RoPredictionParameters';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { OverbookingFactor } from '../../../features/admin/OverbookingFactor/OverbookingFactor';
import { UnplannedDemand } from '../../../features/admin/UnplannedDemand/UnplannedDemand';
import ProbabilityApproach from '../../../features/admin/ProbabilityApproach/ProbabilityApproach';

const DemandManagement = () => {
  const [selectedTab, setTab] = useState<string>('0');
  const handleTabChange = (e: React.ChangeEvent<{}> | null, tab: string) => {
    setTab(tab);
  };
  const { localTab } = useSelector((state: RootState) => state.adminPanel);

  return (
    <TabContext value={selectedTab}>
      <TitleContainer title="Demand Management" pad parent={capacityManagementRoot} />
      <TabList
        onChange={handleTabChange}
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Demand Prediction" value="0" />
        <Tab label="Demand Adjustments" value="1" />
        <Tab label="RO Prediction Parameters" value="2" />
      </TabList>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="0">
        {localTab === '2' ? (
          <ProbabilityApproach />
        ) : (
          <DemandPrediction handleTabChange={handleTabChange} />
        )}
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="1">
        <UnplannedDemand />
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="2">
        <RoPredictionParameters />
      </TabPanel>
    </TabContext>
  );
};

export default DemandManagement;
