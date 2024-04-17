import React, {useState} from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import RoPredictionParameters from "../../../features/admin/RoPredictionParameters/RoPredictionParameters";
import {OverbookingFactor} from "../../../features/admin/OverbookingFactor/OverbookingFactor";
import {UnplannedDemand} from "../../../features/admin/UnplannedDemand/UnplannedDemand";
import {capacityManagementRoot} from "../../../utils/constants";

export const AppointmentAllocation = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Allocation" pad parent={capacityManagementRoot} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
            <Tab label="Unplanned Demand" value="0" />
            <Tab label="RO Prediction Parameters" value="1" />
            <Tab label="Overbooking Factor" value="2" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><UnplannedDemand /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><RoPredictionParameters /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2"><OverbookingFactor/></TabPanel>
    </TabContext>
}