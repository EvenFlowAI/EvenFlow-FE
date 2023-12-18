import React, {useState} from 'react';
import {SquarePaper} from "../../../components/UI/Paper";
import {PaperTitle} from "../../../pages/admin/PricingSettings/UI";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../../../components/UI/Tabs";
import {Tab} from "@material-ui/core";
import PricingLevelsByOpsCode from "../PricingLevelsByOpsCode/PricingLevelsByOpsCode";
import PricingLevelsByPackage from "../PricingLevelsByPackage/PricingLevelsByPackage";

type Tab = {
    id: string;
    label: string;
    component: JSX.Element
}
const tabs: Tab[] = [
    {id: "0", label: "PRICING LEVELS BY OPS CODE", component: <PricingLevelsByOpsCode />},
    {id: "1", label: "PRICING LEVELS BY MAINTENANCE PACKAGE", component: <PricingLevelsByPackage />},
]

const PricingLevelsBy = () => {
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

export default PricingLevelsBy;