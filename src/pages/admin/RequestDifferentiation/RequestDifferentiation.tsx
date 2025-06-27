import React, { useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { capacityManagementRoot } from '../../../utils/constants';
import { Tab } from '@mui/material';
import { TabList } from '../../../components/styled/Tabs';
import DemandSegments from '../../../features/admin/DemandSegments/DemandSegments';
import { ValueIndicatorsTable } from '../../../features/admin/ValueIndicatorsTable/ValueIndicatorsTable';
import { CustomerLifetimeRules } from '../../../features/admin/CustomerLifetimeRules/CustomerLifetimeRules';
import { UrgentRequests } from '../../../features/admin/UrgentRequests/UrgentRequests';
import { NewLostCustomer } from '../../../features/admin/NewLostCustomer/NewLostCustomer';
import { EndOfWarranty } from '../../../features/admin/EndOfWarranty/EndOfWarranty';

type TTab = {
  id: string;
  label: string;
  component: JSX.Element;
};

const RequestDifferentiation = () => {
  const [selectedTab, selectTab] = useState<string>('0');

  const tabs: TTab[] = [
    { id: '0', label: 'Demand Segments', component: <DemandSegments /> },
    {
      id: '1',
      label: 'Value Indicators',
      component: <ValueIndicatorsTable onTabChange={selectTab} />,
    },
    { id: '2', label: 'Customer Lifetime Rules', component: <CustomerLifetimeRules /> },
    { id: '3', label: 'Urgent Requests', component: <UrgentRequests /> },
    { id: '4', label: 'New/Lost Customer', component: <NewLostCustomer /> },
    { id: '5', label: 'End of Warranty', component: <EndOfWarranty /> },
  ];

  const handleTabChange = (e: React.SyntheticEvent, value: string) => {
    selectTab(value);
  };

  return (
    <TabContext value={selectedTab}>
      <TitleContainer title="Request Differentiation" pad parent={capacityManagementRoot} />
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleTabChange}
        indicatorColor="primary"
      >
        {tabs.map(t => {
          return <Tab label={t.label} value={t.id} key={t.id} />;
        })}
      </TabList>
      {tabs.map(t => {
        return (
          <TabPanel style={{ width: '100%', padding: '24px 0' }} key={t.id} value={t.id}>
            {t.component}
          </TabPanel>
        );
      })}
    </TabContext>
  );
};

export default RequestDifferentiation;
