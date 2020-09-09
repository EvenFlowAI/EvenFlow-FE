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


const useStyles = makeStyles({
    panel: {
        width: "100%"
    }
})

const parent: TTitle = {
    to: Routes.Optimizer.Base,
    title: "Optimizer Settings"
}

export const AppointmentValue = () => {
    const [selectedTab, setTab] = useState<string>("1");
    const handleTabChange = (e: React.ChangeEvent<{}>, val: string) => {
        setTab(val);
    }
    const classes = useStyles();
    return <TabContext value={selectedTab}>
        <TitleContainer title="Appointment Value Settings" pad parent={parent} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
        >
            <Tab label="Values indicators" value="0" />
            <Tab label="Customer Lifetime Rules" value="1" />
            <Tab label="Urgent Requests" value="2" />
            <Tab label="New/Lost customer" value="3" />
            <Tab label="End of Warranty" value="4" />
        </TabList>
        <TabPanel className={classes.panel} value="0" ><p>Values indicators</p></TabPanel>
        <TabPanel className={classes.panel} value="1"><CustomerLifetimeRules /></TabPanel>
        <TabPanel className={classes.panel} value="2"><p>Urgent requests</p></TabPanel>
        <TabPanel className={classes.panel} value="3"><NewLostCustomer /></TabPanel>
        <TabPanel className={classes.panel} value="4"><p>End of warranty</p></TabPanel>
    </TabContext>
}