import React, {useState} from 'react';
import {useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {Tab} from "@material-ui/core";
import {RootState} from "../../../store/rootReducer";
import {optimizerRoot} from "../utils";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../../UI/Tabs";
import GeographicZones from "./GeographicZones";
import GeographicZonesMap from "./GeographicZonesMap";
import AddEditGeographicZone from "../../Modals/EditGeographicZone/AddEditGeographicZone";
import AncillaryPrice from "./AncillaryPrice";

type TTab = {
    id: string;
    label: string;
    component: JSX.Element
}

const MobileServicePage = () => {
    const [selectedTab, selectTab] = useState<string>("0");
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const { isLoading } = useSelector((state: RootState) => state.mobileService);
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
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
            <TitleContainer title="Mobile Service" pad parent={optimizerRoot}/>
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
            <AddEditGeographicZone open={isAddZoneOpen} onClose={onAddZoneClose} isEdit={false} serviceType="mobileService"/>
        </TabContext>
};

export default MobileServicePage;