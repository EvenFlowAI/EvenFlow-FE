import React, {useState} from "react";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {ScheduledAppointments} from "./ScheduledAppointments";
import {UnplannedDemand} from "./UnplannedDemand";
import RoPredictionParameters from "./RoPredictionParameters";
import {OverbookingFactor} from "./OverbookingFactor";

export const AppointmentAllocationPage = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Allocation" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
            <Tab label="Scheduled appointments" value="0" />
            <Tab label="Unplanned Demand" value="1" />
            <Tab label="RO Prediction Parameters" value="2" />
            <Tab label="Overbooking Factor" value="3" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><ScheduledAppointments /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><UnplannedDemand /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2"><RoPredictionParameters /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="3"><OverbookingFactor/></TabPanel>
    </TabContext>
}