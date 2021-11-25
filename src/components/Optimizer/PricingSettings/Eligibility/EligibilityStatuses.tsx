import React, {useState} from 'react';
import {Tab} from "@material-ui/core";
import {ServiceCodes} from "./ServiceCodes";
import MaintenancePackages from "./MaintenancePackages";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../../../UI/Tabs";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle} from "../UI";

type Tab = {
    id: string;
    label: string;
    component: JSX.Element
}
const tabs: Tab[] = [
    {id: "0", label: "SERVICE CODES ELIGIBILITY STATUS", component: <ServiceCodes />},
    {id: "1", label: "MAINTENANCE PACKAGES", component: <MaintenancePackages />},
]

const EligibilityStatuses = () => {
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
            </PaperTitle>
        </SquarePaper>
    );
};

export default EligibilityStatuses;