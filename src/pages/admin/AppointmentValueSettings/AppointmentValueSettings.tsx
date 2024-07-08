import React, {useState} from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import {NewLostCustomer} from "../../../features/admin/NewLostCustomer/NewLostCustomer";
import {EndOfWarranty} from "../../../features/admin/EndOfWarranty/EndOfWarranty";
import {TTab} from "./types";
import {useStyles} from "./styles";
import {capacityManagementRoot} from "../../../utils/constants";

const tabs: TTab[] = [
    {label: "New/Lost Customer", id: "3", component: NewLostCustomer},
    {label: "End of Warranty", id: "4", component: EndOfWarranty},
]

export const AppointmentValueSettings = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: any, val: string) => {
        setTab(val);
    }
    const { classes  } = useStyles();
    return <TabContext value={selectedTab}>
        <TitleContainer title="AppointmentFlow Value Settings" pad parent={capacityManagementRoot} />
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