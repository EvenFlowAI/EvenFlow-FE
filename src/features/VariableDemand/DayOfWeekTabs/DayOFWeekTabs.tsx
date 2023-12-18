import React, {useState} from 'react';
import {SquarePaper} from "../../../components/UI/Paper";
import {PaperTitle} from "../../../pages/admin/PricingSettings/UI";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../../../components/UI/Tabs";
import {Tab} from "@material-ui/core";
import DayOfWeekOpsCode from "./DayOfWeekOpsCode/DayOfWeekOpsCode";
import DayOfWeekPackage from "./DayOfWeekPackage/DayOfWeekPackage";

type Tab = {
    id: string;
    label: string;
    component: JSX.Element
}
const tabs: Tab[] = [
    {id: "0", label: "DAY OF WEEK OPS CODE", component: <DayOfWeekOpsCode />},
    {id: "1", label: "DAY OF WEEK MAINTENANCE PACKAGE", component: <DayOfWeekPackage />},
]

const DayOfWeekTabs = () => {
    const [selectedTab, selectTab] = useState<string>("0");

    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }

    return (
        <SquarePaper variant="outlined">
            <PaperTitle>
                <TabContext value={selectedTab}>
                    <TabList
                        onChange={handleTabChange}
                        indicatorColor="primary"
                    >
                        {tabs.map(t => {
                            return <Tab label={t.label} value={t.id} key={t.id} style={{ maxWidth: 350 }}/>;
                        })}
                    </TabList>
                </TabContext>
            </PaperTitle>

            <TabContext value={selectedTab}>
                {tabs.map(t => {
                    return <TabPanel
                        style={{width: "100%", padding: "0"}}
                        key={t.id}
                        value={t.id}>
                        {t.component}
                    </TabPanel>
                })}
            </TabContext>
        </SquarePaper>
    );
};

export default DayOfWeekTabs;