import React, {useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import { PricingLevels } from './PricingLevels';
import {Eligibility} from "./Eligibility/Eligibility";
import {PricingOptimization} from "./PricingOptimization";

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
            <Tab label="Eligibility" value="0" />
            <Tab label="Pricing Levels" value="1" />
            <Tab label="Pricing Optimization" value="2" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><Eligibility /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><PricingLevels /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2"><PricingOptimization /></TabPanel>
    </TabContext>
};