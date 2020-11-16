import React, {useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import { PricingLevels } from './PricingLevels';

export const PricingSettingsPage = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }
    return <TabContext value={selectedTab}>
        <TitleContainer title="Pricing Settings" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
        >
            <Tab label="Pricing Levels" value="0" />
            <Tab label="Pricing Optimization" value="1" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><PricingLevels /></TabPanel>
    </TabContext>
};