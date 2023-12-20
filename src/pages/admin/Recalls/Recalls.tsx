import React, {useState} from 'react';
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@material-ui/core";
import RecallParts from "../../../features/admin/RecallsParts/RecallParts";
import RecallsAllOtherParts from "../../../features/admin/RecallsAllOtherParts/RecallsAllOtherParts";
import {optimizerRoot} from "../../../config/constants";

const Recalls = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Parts Availability" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Recall Parts" value="0" />
            <Tab label="All Other Parts" value="1" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><RecallParts /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><RecallsAllOtherParts /></TabPanel>
    </TabContext>
};

export default Recalls;