import React, {useState} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import {optimizerRoot} from "../utils";
import {Proximity} from "./Proximity";
import {TODDesirability} from "./TODDesirability";

export const AppointmentSlotScoring = () => {
    const [selectedTab, setTab] = useState<string>("1");
    // TODO: 0 as default

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Slot Scoring" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
        >
            <Tab label="Proximity" value="0" />
            <Tab label="Time of Day desirability" value="1" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><Proximity /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><TODDesirability /></TabPanel>
    </TabContext>
}