import React, {useState} from 'react';
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import MakesModelsTable from "./parts/MakesModelsTable/MakesModelsTable";
import MileageTable from "./parts/MileageTable/MileageTable";
import {bookingFlowRoot} from "../../Optimizer/utils";
import EngineTypeTable from "./parts/EngineTypeTable/EngineTypeTable";

export const VehicleDetails = () => {
    const [selectedTab, setTab] = useState<string>("0");

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Vehicle Detail Options" pad parent={bookingFlowRoot}/>
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Make And Model" value="0"/>
            <Tab label="Estimated Mileage" value="1"/>
            <Tab label="Engine Type" value="2"/>
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">
            <MakesModelsTable/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
            <MileageTable/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2">
            <EngineTypeTable/>
        </TabPanel>
    </TabContext>;
}