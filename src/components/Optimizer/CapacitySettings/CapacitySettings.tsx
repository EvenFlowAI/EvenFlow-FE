import React, {useState} from "react";
import {Tab} from "@material-ui/core";
import {TabList} from "../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import {AvailableStaff} from "./AvailableStaff/AvailableStaff";
import {RequiredEquipment} from "./RequiredEquipment";
import {RequiredSkills} from "./RequiredSkills";
import {TechnicianStaff} from "./TechnicianStaff";

export const CapacitySettings = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: React.ChangeEvent<{}>, val: string) => {
        setTab(val);
    }
    return <TabContext value={selectedTab}>
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
        >
            <Tab label="Available Staff" value="0" />
            <Tab label="Required Equipment" value="1" />
            <Tab label="Required Skills" value="2" />
            <Tab label="Technician Staff" value="3" />
        </TabList>
        <TabPanel value="0" ><AvailableStaff /></TabPanel>
        <TabPanel value="1"><RequiredEquipment /></TabPanel>
        <TabPanel value="2"><RequiredSkills /></TabPanel>
        <TabPanel value="3"><TechnicianStaff /></TabPanel>
    </TabContext>
}