import React, {useState} from "react";
import {Tab} from "@material-ui/core";
import {TabList} from "../../../components/styled/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import {RequiredEquipment} from "../../../features/admin/RequiredEquipment/RequiredEquipment";
import {RequiredSkills} from "../../../features/admin/RequiredSkills/RequiredSkills";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {makeStyles} from "@material-ui/core/styles";
import {AvailableStaffCalendar} from "../../../features/admin/AvailableStaffCalendar/AvailableStaffCalendar";
import {optimizerRoot} from "../../../utils/constants";

const useStyles = makeStyles(theme => ({
    panel: {
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            padding: `${theme.spacing(3)}px 0`
        }
    }
}))

export const CapacitySettings = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: React.ChangeEvent<{}>, val: string) => {
        setTab(val);
    }
    const classes = useStyles();
    return <TabContext value={selectedTab}>
        <TitleContainer title="Capacity Settings" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Available Staff" value="0" />
            <Tab label="Required Equipment" value="1" />
            <Tab label="Required Skills" value="2" />
        </TabList>
        <TabPanel className={classes.panel} value="0" ><AvailableStaffCalendar /></TabPanel>
        <TabPanel className={classes.panel} value="1"><RequiredEquipment /></TabPanel>
        <TabPanel className={classes.panel} value="2"><RequiredSkills /></TabPanel>
    </TabContext>
}