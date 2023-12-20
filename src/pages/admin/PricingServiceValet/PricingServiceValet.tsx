import React, {useState} from 'react';
import {useModal} from "../../../utils/hooks";
import {Tab} from "@material-ui/core";
import {TitleContainer} from "../../../components/UI/TitleContainer";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../../../components/styled/Tabs";
import GeographicZones from "../../../features/PricingServiceValet/GeographicZones/GeographicZones";
import GeographicZonesMap from "../../../features/PricingServiceValet/GeographicZonesMap/GeographicZonesMap";
import AddEditGeographicZone from "../../../components/Modals/admin/EditGeographicZone/AddEditGeographicZone";
import AncillaryPrice from "../../../features/PricingServiceValet/AncillaryPrice/AncillaryPrice";
import {pricingRoot} from "../../../config/constants";

type TTab = {
    id: string;
    label: string;
    component: JSX.Element
}

const PricingServiceValet = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const {onOpen: onAddZoneOpen, onClose: onAddZoneClose, isOpen: isAddZoneOpen} = useModal();

    const tabs: TTab[] = [
        {id: "0", label: "Geographic Zones", component: <GeographicZones onAddZoneOpen={onAddZoneOpen}/>},
        {id: "1", label: "Geographic Zones Map", component: <GeographicZonesMap />},
        {id: "2", label: "Ancillary Price", component: <AncillaryPrice />},
    ]

    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }

    return <TabContext value={selectedTab}>
            <TitleContainer title="Service Valet" pad parent={pricingRoot}/>
            <TabList
                variant="scrollable"
                scrollButtons="auto"
                onChange={handleTabChange}
                indicatorColor="primary"
            >
                {tabs.map(t => {
                    return <Tab label={t.label} value={t.id} key={t.id} />;
                })}
            </TabList>
            {tabs.map(t => {
                return <TabPanel
                    style={{width: "100%"}}
                    key={t.id}
                    value={t.id}>
                    {t.component}
                </TabPanel>
            })}
            <AddEditGeographicZone open={isAddZoneOpen} onClose={onAddZoneClose} isEdit={false} serviceType="serviceValet"/>
        </TabContext>
};

export default PricingServiceValet;