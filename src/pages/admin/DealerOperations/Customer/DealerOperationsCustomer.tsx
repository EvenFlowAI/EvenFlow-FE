import React, { useState } from 'react';
import { dealerOperationsRoot } from '../../../../utils/constants';
import { TitleContainer } from '../../../../components/wrappers/TitleContainer/TitleContainer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { TabContext, TabPanel } from '@mui/lab';
import TextIntegration from './TextIntegration/TextIntegration';
import DealerCustomerSettings from './Configuration/DealerCustomerSettings';
import { useStyles } from './CommunicationDashboard/styles';
import TabWrapper from './CommunicationDashboard/TabWrapper';
import CommunicationDashboard from './CommunicationDashboard/CommunicationDashboard';

const DealerOperationsCustomer = () => {
  const { classes } = useStyles();

  const { eventIdForRulesConfiguration } = useSelector(
    (state: RootState) => state.dealerOperations
  );

  const [activeTab, setActiveTab] = useState<string>('0');

  if (eventIdForRulesConfiguration) {
    return <DealerCustomerSettings />;
  }

  return (
    <div className={classes.wrapper}>
      <TabContext value={activeTab}>
        <TitleContainer title="Customer" pad parent={dealerOperationsRoot} />
        <TabWrapper setActiveTab={setActiveTab} />
        <TabPanel className={classes.tabPanel} value="0">
          <CommunicationDashboard />
        </TabPanel>
        <TabPanel className={classes.rightTab} value="1">
          <TextIntegration />
        </TabPanel>
        <TabPanel className={classes.rightTab} value="2">
          TEST
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default DealerOperationsCustomer;
