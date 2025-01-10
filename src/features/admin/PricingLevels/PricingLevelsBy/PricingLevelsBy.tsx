import React, { useState } from "react";
import { SquarePaper } from "../../../../components/styled/Paper";
import { PaperTitle } from "../../../../pages/admin/ServicePricingSettings/UI";
import { TabContext, TabPanel } from "@mui/lab";
import { TabList } from "../../../../components/styled/Tabs";
import { Tab } from "@mui/material";
import PricingLevelsByOpsCode from "../PricingLevelsByOpsCode/PricingLevelsByOpsCode";
import PricingLevelsByPackage from "../PricingLevelsByPackage/PricingLevelsByPackage";

type Tab = {
  id: string;
  label: string;
  component: JSX.Element;
};
const tabs: Tab[] = [
  {
    id: "0",
    label: "Configuration Settings by Op Code",
    component: <PricingLevelsByOpsCode />,
  },
  {
    id: "1",
    label: "Configuration Settings by Maintenance Package",
    component: <PricingLevelsByPackage />,
  },
];

const PricingLevelsBy = () => {
  const [selectedTab, selectTab] = useState<string>("0");

  const handleTabChange = (e: any, value: string) => {
    selectTab(value);
  };

  return (
    <SquarePaper variant="outlined">
      <PaperTitle>
        <TabContext value={selectedTab}>
          <TabList onChange={handleTabChange} indicatorColor="primary">
            {tabs.map((t) => {
              return (
                <Tab
                  label={t.label}
                  value={t.id}
                  key={t.id}
                  style={{ maxWidth: 350 }}
                />
              );
            })}
          </TabList>
        </TabContext>
      </PaperTitle>

      <TabContext value={selectedTab}>
        {tabs.map((t) => {
          return (
            <TabPanel
              style={{ width: "100%", padding: "0" }}
              key={t.id}
              value={t.id}
            >
              {t.component}
            </TabPanel>
          );
        })}
      </TabContext>
    </SquarePaper>
  );
};

export default PricingLevelsBy;
