import React, {useState} from 'react';
import {TabContext, TabPanel} from "@mui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {capacityManagementRoot} from "../../../utils/constants";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import {TimeOfDayDesirability} from "../../../features/admin/TimeOfDayDesirability/TimeOfDayDesirability";

type TTab = {
    id: string;
    label: string;
    component: JSX.Element
}

const tabs: TTab[] = [
    {id: "0", label: "Time Of Day Desirability", component: <TimeOfDayDesirability />},
    {id: "1", label: "Search Windows", component: <div/> },
    {id: "2", label: "Time Windows", component: <div/>},
]

const TimeDifferentiation = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }
    return <TabContext value={selectedTab}>
        <TitleContainer title="Time Differentiation" pad parent={capacityManagementRoot}/>
        <TabList
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleTabChange}
            indicatorColor="primary"
        >
            {tabs.map(t => {
                return <Tab label={t.label} value={t.id} key={t.id} />;
            })}
        </TabList>
        {tabs.map(t => {
            return <TabPanel
                style={{width: "100%", padding: "24px 0"}}
                key={t.id}
                value={t.id}>
                {t.component}
            </TabPanel>
        })}
    </TabContext>
};

export default TimeDifferentiation;