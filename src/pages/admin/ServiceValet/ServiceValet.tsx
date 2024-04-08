import React, {useState} from 'react';
import {Tab} from "@mui/material";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabContext, TabPanel} from "@mui/lab";
import {TabList} from "../../../components/styled/Tabs";
import GeographicZones from "../../../features/admin/PricingServiceValet/GeographicZones/GeographicZones";
import GeographicZonesMap from "../../../features/admin/PricingServiceValet/GeographicZonesMap/GeographicZonesMap";
import AddEditGeographicZone from "../../../components/modals/admin/EditGeographicZone/AddEditGeographicZone";
import AncillaryPrice from "../../../features/admin/PricingServiceValet/AncillaryPrice/AncillaryPrice";
import {servicesRoot} from "../../../utils/constants";
import {useModal} from "../../../hooks/useModal/useModal";
import CenterSettings from "../../../features/admin/CenterSettings/CenterSettings";
import ZoneRouting from "../../../features/admin/ZoneRouting/ZoneRouting";
import TimeRangesAndCapacity from "../../../features/admin/TimeRangesAndCapacity/TimeRangesAndCapacity";

type TTab = {
    id: string;
    label: string;
    component: JSX.Element
}

const ServiceValet = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const {onOpen: onAddZoneOpen, onClose: onAddZoneClose, isOpen: isAddZoneOpen} = useModal();

    const tabs: TTab[] = [
        {id: "0", label: "Geographic Zones", component: <GeographicZones onAddZoneOpen={onAddZoneOpen}/>},
        {id: "1", label: "Geographic Zones Map", component: <GeographicZonesMap />},
        {id: "2", label: "Center Settings", component: <CenterSettings />},
        {id: "3", label: "Zone Routing", component: <ZoneRouting />},
        {id: "4", label: "Time Ranges & Capacity", component: <TimeRangesAndCapacity />},
        {id: "5", label: "Convenience Fees", component: <AncillaryPrice />},
    ]

    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }

    return <TabContext value={selectedTab}>
            <TitleContainer title="Service Valet" pad parent={servicesRoot}/>
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

export default ServiceValet;