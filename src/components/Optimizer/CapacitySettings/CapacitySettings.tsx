import React, {useState} from "react";
import {Tab} from "@material-ui/core";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";

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
        <TabPanel value="0"><p>Content 1</p></TabPanel>
        <TabPanel value="1"><p>Content 2</p></TabPanel>
        <TabPanel value="2"><p>Content 3</p></TabPanel>
        <TabPanel value="3"><p>Content 3</p></TabPanel>
    </TabContext>
}