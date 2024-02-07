import React, {useState} from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {employeesRoot} from "../../../utils/constants";
import {Tab} from "@mui/material";
import {TabList} from "../../../components/styled/Tabs";
import {TabContext, TabPanel} from "@mui/lab";
import BaseScheduleSummary from "../../../features/admin/BaseScheduleSummary/BaseScheduleSummary";

const tabNames = [
    "Base Schedule Summary",
    "Base Schedule by Employee"
];

const EmployeesScheduleSetUp = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = async (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }
    return <>
        <TabContext value={selectedTab}>
        <TitleContainer title={"Schedule Set Up"} pad parent={employeesRoot}/>
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            {tabNames.map((name, index) => <Tab label={name} value={`${index}`} key={name}/>)}
        </TabList>
            <TabPanel style={{width: "100%", padding: "24px 0"}} value="0" key="0">
                <BaseScheduleSummary/>
            </TabPanel>
            <TabPanel style={{width: "100%", padding: "24px 0"}} value="1" key="1">

            </TabPanel>
        </TabContext>
        </>;
};

export default EmployeesScheduleSetUp;