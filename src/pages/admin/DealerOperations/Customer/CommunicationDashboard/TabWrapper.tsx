import React from 'react';
import { TabList } from '../../../../../components/styled/Tabs';
import { Tab } from '@mui/material';

const TabWrapper = ({ setActiveTab }: { setActiveTab: (activeTab: string) => void }) => {
  return (
    <TabList
      onChange={(e, tab) => setActiveTab(tab)}
      indicatorColor="primary"
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab label="Communication Dashboard" value="0" />
      <Tab label="Text Integration" value="1" />
    </TabList>
  );
};

export default TabWrapper;
