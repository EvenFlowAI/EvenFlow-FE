import React, {useState} from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabContext, TabPanel} from "@mui/lab";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import {ActiveOffers} from "./ActiveOffers/ActiveOffers";
import {ArchiveOffers} from "./ArchiveOffers/ArchiveOffers";
import {pricingRoot} from "../../../utils/constants";

export const OfferManagement = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const handleTabChange = (e: any, val: string) => {
        setTab(val);
    }
    return (
        <div style={{width: "100%"}}>
            <TitleContainer title={"Offer Management"} parent={pricingRoot} />
            <TabContext value={selectedTab}>
                <TabList
                    variant="scrollable"
                    scrollButtons="auto"
                    style={{marginTop: 10}}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                >

                <Tab label="Active Offers" value={"0"} />
                <Tab label="Archive Offers" value={"1"} />

                </TabList>
                <TabPanel style={{width: "100%", padding: "16px 0"}} value={"0"}><ActiveOffers /></TabPanel>
                <TabPanel style={{width: "100%", padding: "16px 0"}} value={"1"}><ArchiveOffers /></TabPanel>
            </TabContext>
        </div>
    );
};