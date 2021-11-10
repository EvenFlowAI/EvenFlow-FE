import React, {useState} from 'react';
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";

export const VehicleDetails = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Vehicle Options" pad />
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Make And Model" value="0"/>
            <Tab label="Estimated Mileage" value="1"/>
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">

        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">

        </TabPanel>
    </TabContext>;
}