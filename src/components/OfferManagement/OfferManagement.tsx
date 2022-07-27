import React, {useState} from 'react';
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../UI/Tabs";
import {Tab} from "@material-ui/core";
import {ActiveOffers} from "./Offers/ActiveOffers";
import {ArchiveOffers} from "./Offers/ArchiveOffers";
import {pricingRoot} from "../Optimizer/utils";

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