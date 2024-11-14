import React, {useEffect, useState} from 'react';
import {Titles} from "../../../types/types";
import {applicationRoot} from "../../../utils/constants";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {TabContext, TabPanel} from "@mui/lab";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import ApplicationMakes from "../../../features/admin/ApplicationMakes/ApplicationMakes";
import ApplicationModels from "../../../features/admin/ApplicationModels/ApplicationModels";
import {loadAllGlobalMakes} from "../../../store/reducers/globalVehicles/actions";
import {useDispatch} from "react-redux";

const ApplicationVehicles = () => {
    const [tab, setTab] = useState<string>("0")
    const dispatch = useDispatch();

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => setTab(tab)

    useEffect(() => {
        dispatch(loadAllGlobalMakes())
    }, [])

    return (
        <>
            <TitleContainer
                title={Titles.Vehicles}
                parent={applicationRoot}
                pad />
            <TabContext value={tab}>
                <TabList
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Makes" value="0" />
                    <Tab label="Models" value="1" />
                </TabList>
                <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><ApplicationMakes/></TabPanel>
                <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><ApplicationModels/></TabPanel>
            </TabContext>
        </>
    );
};

export default ApplicationVehicles;