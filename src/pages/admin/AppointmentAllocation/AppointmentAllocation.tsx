import React, {useEffect} from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import RoPredictionParameters from "../../../features/admin/RoPredictionParameters/RoPredictionParameters";
import {OverbookingFactor} from "../../../features/admin/OverbookingFactor/OverbookingFactor";
import {UnplannedDemand} from "../../../features/admin/UnplannedDemand/UnplannedDemand";
import {capacityManagementRoot} from "../../../utils/constants";
import {RootState} from "../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {setAllocationTab} from "../../../store/reducers/adminPanel/actions";

export const AppointmentAllocation = () => {
    const {appointmentAllocationTab} = useSelector((state: RootState) => state.adminPanel);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setAllocationTab("0"))
        }
    }, [])

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        dispatch(setAllocationTab(tab))
    }

    return <TabContext value={appointmentAllocationTab}>
        <TitleContainer title="AppointmentFlow Allocation" pad parent={capacityManagementRoot} />
        <TabList
            onChange={handleTabChange}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
            <Tab label="Unplanned Demand" value="0" />
            <Tab label="RO Prediction Parameters" value="1" />
            <Tab label="Overbooking Factor" value="2" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><UnplannedDemand /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><RoPredictionParameters /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2"><OverbookingFactor/></TabPanel>
    </TabContext>
}