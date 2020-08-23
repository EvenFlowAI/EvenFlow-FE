import React, {useState} from "react";
import {Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {AvailableStaff} from "./AvailableStaff/AvailableStaff";
import {RequiredEquipment} from "./RequiredEquipment";
import {RequiredSkills} from "./RequiredSkills";
import {TechnicianStaff} from "./TechnicianStaff";

const useStyles = makeStyles(theme => ({
    tabList: {
        width: "100%",
        "& .MuiTab-root": {
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "none"
        },
        "& .MuiTabs-indicator": {
            height: 5
        }
    },
    panel: {
        width: "100%",
        padding: "24px 0"
    },
    separator: {
        height: 0,
        width: "calc(100% + 80px)",
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: "0 -40px"
    }
}));

export const CapacitySettings = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: React.ChangeEvent<{}>, val: string) => {
        setTab(val);
    }
    const classes = useStyles();
    return <TabContext value={selectedTab}>
        <TabList
            className={classes.tabList}
            onChange={handleTabChange}
            indicatorColor="primary"
        >
            <Tab label="Available Staff" value="0" />
            <Tab label="Required Equipment" value="1" />
            <Tab label="Required Skills" value="2" />
            <Tab label="Technician Staff" value="3" />
        </TabList>
        <div className={classes.separator} />
        <TabPanel className={classes.panel} value="0" ><AvailableStaff /></TabPanel>
        <TabPanel className={classes.panel} value="1"><RequiredEquipment /></TabPanel>
        <TabPanel className={classes.panel} value="2"><RequiredSkills /></TabPanel>
        <TabPanel className={classes.panel} value="3"><TechnicianStaff /></TabPanel>
    </TabContext>
}