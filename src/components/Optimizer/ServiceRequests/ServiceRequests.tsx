import React, {useState} from "react";
import {Tab} from "@material-ui/core";
import {TabList} from "../../UI/Tabs";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../../Optimizer/utils";
import {OPsCodesPage} from "../../Optimizer/OPsCodes/OPsCodesPage";
import {MaintenancePackages} from "../../Optimizer/MaintenancePackages/MaintenancePackages";
import ComplimentaryServices from "../ComplimentaryServices/ComplimentaryServices";

export const ServiceRequests = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Service Requests" pad parent={optimizerRoot}/>
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Service Ops Code" value="0"/>
            <Tab label="Maintenance Packages" value="1"/>
            <Tab label="Complimentary Services" value="2"/>
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">
            <OPsCodesPage/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
            <MaintenancePackages/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2" >
            <ComplimentaryServices/>
        </TabPanel>
    </TabContext>;
}