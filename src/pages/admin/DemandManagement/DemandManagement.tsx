import React, { useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { capacityManagementRoot } from '../../../utils/constants';
import { TabList } from '../../../components/styled/Tabs';
import { Tab } from '@mui/material';
import DemandPrediction from '../../../features/admin/DemandPrediction/DemandPrediction';

const DemandManagement = () => {
  const [selectedTab, setTab] = useState<string>('0');
  const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
    setTab(tab);
  };

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
      </TabList>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="0">
        <DemandPrediction />
      </TabPanel>
      <TabPanel style={{ width: '100%', padding: '24px 0' }} value="1">
        <div />
      </TabPanel>
    </TabContext>
  );
};

export default DemandManagement;
