import React, {useState} from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {employeesRoot} from "../../../utils/constants";
import {Tab} from "@mui/material";
import {TabList} from "../../../components/styled/Tabs";
import {TabContext, TabPanel} from "@mui/lab";
import CapacityAdvisors from "../../../features/admin/CapacityAdvisors/CapacityAdvisors";
import CapacityTechnicians from "../../../features/admin/CapacityTechnicians/CapacityTechnicians";

const tabNames = [
    "Service Advisors",
    "Technicians"
];

const EmployeeCapacity = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = async (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }
    return <>
        <TabContext value={selectedTab}>
        <TitleContainer title={"Employee Capacity"} pad parent={employeesRoot}/>
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            {tabNames.map((name, index) => <Tab label={name} value={`${index}`} key={name}/>)}
        </TabList>
            <TabPanel style={{width: "100%", padding: "24px 0"}} value="0" key="0">
                <CapacityAdvisors/>
            </TabPanel>
            <TabPanel style={{width: "100%", padding: "12px 0"}} value="1" key="1">
                <CapacityTechnicians/>
            </TabPanel>
        </TabContext>
        </>;
};

export default EmployeeCapacity;