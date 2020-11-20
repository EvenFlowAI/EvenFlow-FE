import React, {useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {TabContext, TabPanel} from "@material-ui/lab";
import { PricingLevels } from './PricingLevels';
import {Eligibility} from "./Eligibility/Eligibility";
import {PricingOptimization} from "./PricingOptimization";
import {VariableDemand} from "./VariableDemand";


type Tab = {
    id: string;
    label: string;
    component: JSX.Element
}
const tabs: Tab[] = [
    {id: "0", label: "Variable demand", component: <VariableDemand />},
    {id: "1", label: "Eligibility", component: <Eligibility />},
    {id: "2", label: "Pricing Levels", component: <PricingLevels />},
    {id: "3", label: "Pricing Optimization", component: <PricingOptimization />},
]
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