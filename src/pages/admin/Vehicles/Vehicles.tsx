import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { TitleContainer } from "../../../components/wrappers/TitleContainer/TitleContainer";
import { TabList } from "../../../components/styled/Tabs";
import { Tab } from "@mui/material";
import { Mileage } from "../../../features/admin/Mileage/Mileage";
import { centerProfileRoot } from "../../../utils/constants";
import { EngineTypes } from "../../../features/admin/EngineTypes/EngineTypes";
import { MakesModels } from "../../../features/admin/MakesModels/MakesModels";

export const Vehicles = () => {
  const [selectedTab, setTab] = useState<string>("0");

  const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
    setTab(tab);
  };

  return (
    <TabContext value={selectedTab}>
      <TitleContainer title="Vehicles" pad parent={centerProfileRoot} />
      <TabList
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
      >
        <Tab label="Make And Model" value="0" />
        <Tab label="Estimated Mileage" value="1" />
        <Tab label="Engine Type" value="2" />
      </TabList>
      <TabPanel style={{ width: "100%", padding: "24px 0" }} value="0">
        <MakesModels />
      </TabPanel>
      <TabPanel style={{ width: "100%", padding: "24px 0" }} value="1">
        <Mileage />
      </TabPanel>
      <TabPanel style={{ width: "100%", padding: "24px 0" }} value="2">
        <EngineTypes />
      </TabPanel>
    </TabContext>
  );
};
