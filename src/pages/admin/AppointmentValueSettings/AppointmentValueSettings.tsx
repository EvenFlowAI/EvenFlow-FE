import React, {useState} from "react";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@material-ui/core";
import {CustomerLifetimeRules} from "../../../features/admin/CustomerLifetimeRules/CustomerLifetimeRules";
import {NewLostCustomer} from "../../../features/admin/NewLostCustomer/NewLostCustomer";
import {EndOfWarranty} from "../../../features/admin/EndOfWarranty/EndOfWarranty";
import {ValueIndicatorsTable} from "../../../features/admin/ValueIndicatorsTable/ValueIndicatorsTable";
import {UrgentRequests} from "../../../features/admin/UrgentRequests/UrgentRequests";
import {TTab} from "./types";
import {useStyles} from "./styles";
import {optimizerRoot} from "../../../utils/constants";

const tabs: TTab[] = [
    {label: "Value Indicators", id: "0", component: ValueIndicatorsTable},
    {label: "Customer Lifetime Rules", id: "1", component: CustomerLifetimeRules},
    {label: "Urgent Requests", id: "2", component: UrgentRequests},
    {label: "New/Lost Customer", id: "3", component: NewLostCustomer},
    {label: "End of Warranty", id: "4", component: EndOfWarranty},
]

export const AppointmentValueSettings = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: any, val: string) => {
        setTab(val);
    }
    const classes = useStyles();
    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Value Settings" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
            {tabs.map(tab =>
                <Tab label={tab.label} key={tab.id} value={tab.id} />
            )}
        </TabList>
        {tabs.map(tab =>
            <TabPanel key={tab.id} className={classes.panel} value={tab.id}>
                <tab.component onTabChange={handleTabChange} />
            </TabPanel>
        )}
    </TabContext>
}