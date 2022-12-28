import React, {useEffect, useState} from 'react';
import {TabContext, TabPanel} from "@material-ui/lab";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {TabList} from "../../UI/Tabs";
import {Tab} from "@material-ui/core";
import ZoneRouting from "./ZoneRouting";
import ZoneTimeWindows from "./ZoneTimeWindows";
import ZoneCapacity from "./ZoneCapacity";
import {loadServiceValetZones} from "../../../store/reducers/serviceValet/actions";
import {useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {loadHoursOfOperations} from "../../../store/reducers/slotScoring/actions";

const CapacityServiceValet = () => {
    const [selectedTab, setTab] = useState<string>("0");
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadServiceValetZones(selectedSC.id))
            dispatch(loadHoursOfOperations(selectedSC.id))
        }
    }, [selectedSC])

    const handleTabChange = (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    return <TabContext value={selectedTab}>
        <TitleContainer title="Service Valet" pad parent={optimizerRoot} />
        <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
        >
            <Tab label="Zone Routing" value="0" />
            <Tab label="Zone Time Windows" value="1" />
            <Tab label="Zone Capacity" value="2" />
        </TabList>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="0"><ZoneRouting/></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="1"><ZoneTimeWindows /></TabPanel>
        <TabPanel style={{width: "100%", padding: "24px 0"}} value="2"><ZoneCapacity /></TabPanel>
    </TabContext>
};

export default CapacityServiceValet;