import React, {useState} from "react";
import {Tab} from "@material-ui/core";
import {TabList} from "../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import {AvailableStaff} from "./AvailableStaff/AvailableStaff";
import {RequiredEquipment} from "./RequiredEquipment";
import {RequiredSkills} from "./RequiredSkills";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {makeStyles} from "@material-ui/core/styles";
import {optimizerRoot} from "../utils";

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
        <TabPanel className={classes.panel} value="0" ><AvailableStaff /></TabPanel>
        <TabPanel className={classes.panel} value="1"><RequiredEquipment /></TabPanel>
        <TabPanel className={classes.panel} value="2"><RequiredSkills /></TabPanel>
    </TabContext>
}