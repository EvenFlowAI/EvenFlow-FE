import React from "react";
import {Tab} from "@mui/material";
import {TabList} from "../../../components/styled/Tabs";
import {TabContext, TabPanel} from "@mui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {ServiceRequests} from "../../../features/admin/ServiceRequests/ServiceRequests";
import {MaintenancePackages} from "../../../features/admin/MaintenancePackages/MaintenancePackages";
import {ComplimentaryServices} from "../../../features/admin/ComplimentaryServices/ComplimentaryServices";
import {setServiceRequestsPageActiveTab} from "../../../store/reducers/serviceRequests/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IntervalUpsell} from "../../../features/admin/IntervallUpsell/IntervalUpsell";
import {servicesRoot} from "../../../utils/constants";
import RecallParts from "../../../features/admin/RecallsParts/RecallParts";

export const VehicleServices = () => {
    const {srPageActiveTab} = useSelector((state: RootState) => state.serviceRequests);
    const dispatch = useDispatch();

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        dispatch(setServiceRequestsPageActiveTab(tab))
    }

    return <TabContext value={srPageActiveTab}>
        <TitleContainer title="Vehicle Services" pad parent={servicesRoot}/>
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Service Ops Code" value="0"/>
            <Tab label="Maintenance Packages" value="1"/>
            <Tab label="Complimentary Services" value="2"/>
            <Tab label="Interval Upsell" value="3"/>
            <Tab label="Recalls" value="4"/>
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">
            <ServiceRequests/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
            <MaintenancePackages/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2" >
            <ComplimentaryServices/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="3" >
            <IntervalUpsell/>
        </TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="4" >
            <RecallParts/>
        </TabPanel>
    </TabContext>;
}