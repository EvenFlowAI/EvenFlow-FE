import React, {useState} from "react";
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import {ProximityTable} from "../../../features/ProximityTable/ProximityTable";
import {TimeOfDayDesirability} from "../../../features/TimeOfDayDesirability/TimeOfDayDesirability";
import {optimizerRoot} from "../../../config/constants";

export const AppointmentSlotScoring = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Slot Scoring" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Proximity" value="0" />
            <Tab label="Time of Day Desirability" value="1" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><ProximityTable /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><TimeOfDayDesirability /></TabPanel>
    </TabContext>
}