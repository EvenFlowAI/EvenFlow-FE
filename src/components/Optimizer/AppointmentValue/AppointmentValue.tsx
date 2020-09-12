import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {TTitle} from "../../Content/ContentTitle/ContentTitle";
import {Routes} from "../../../config/routes";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import {CustomerLifetimeRules} from "./CustomerLifetimeRules/CustomerLifetimeRules";
import {NewLostCustomer} from "./NewLostCustomer/NewLostCustomer";
import {EndOfWarranty} from "./EndOfWarranty/EndOfWarranty";
import {ValueIndicators} from "./ValueIndicators/ValueIndicators";


const useStyles = makeStyles({
    panel: {
        width: "100%"
    }
})

const parent: TTitle = {
    to: Routes.Optimizer.Base,
    title: "Optimizer Settings"
}

type Tab = {
    label: string;
    id: string;
    component: React.ComponentType<{
        onTabChange?: (e: any, tab: string) => void
    }>
}

const tabs: Tab[] = [
    {label: "Values indicators", id: "0", component: ValueIndicators},
    {label: "Customer Lifetime Rules", id: "1", component: CustomerLifetimeRules},
    {label: "Urgent Requests", id: "2", component: () => <p>Urgent Requests</p>},
    {label: "New/Lost customer", id: "3", component: NewLostCustomer},
    {label: "End of Warranty", id: "4", component: EndOfWarranty},
]

export const AppointmentValue = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: any, val: string) => {
        setTab(val);
    }
    const classes = useStyles();
    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Value Settings" pad parent={parent} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
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