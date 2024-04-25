import React, {useState} from 'react';
import {RadioBlock, RadioGroupLabel} from "./styles";
import {FormControlLabel, Radio, RadioGroup, Tab} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ECapacityType} from "../../../store/reducers/employeeCapacity/types";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {TabList} from "../../../components/styled/Tabs";
import {TabContext, TabPanel} from "@mui/lab";
import CapacityTechniciansTable from "./CapacityTechniciansTable/CapacityTechniciansTable";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {updateTechniciansCapacityType} from "../../../store/reducers/employeeCapacity/actions";
import {useException} from "../../../hooks/useException/useException";

const CapacityTechnicians = () => {
    const {capacityTypeOption, isSettingLoading} = useSelector((state: RootState) => state.employeesCapacity);
    const [selectedTab, setTab] = useState<string>("0");
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();

    const handleTabChange = async (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
    }

    const handleType = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        if (selectedSC) {
            dispatch(updateTechniciansCapacityType(
                selectedSC.id,
                value === "DailyVehicles" ? ECapacityType.DailyVehicles : ECapacityType.AvailableBillHours,
                selectedTab === "0" ? ECapacityType.DailyVehicles : ECapacityType.AvailableBillHours,
                showError
            ))
        }
    }

    return (
        <div>
            {isSettingLoading
                ? <Loading/>
                : <RadioBlock>
                    <RadioGroupLabel>Capacity Based On</RadioGroupLabel>
                    <RadioGroup
                        row
                        aria-label="countType"
                        name="countType"
                        value={capacityTypeOption === ECapacityType.DailyVehicles ? 'DailyVehicles' : 'AvailableBillHours'}
                        onChange={handleType}
                    >
                        <FormControlLabel
                            value={"DailyVehicles"}
                            control={<Radio color="primary"/>}
                            label="Daily Vehicles"
                        />
                        <FormControlLabel
                            value={"AvailableBillHours"}
                            control={<Radio color="primary"/>}
                            label="Available Bill Hours"
                        />
                    </RadioGroup>
                </RadioBlock> }
            <TabContext value={selectedTab}>
                <TabList
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="primary"
                >
                    <Tab label="Daily Vehicles" value="0" key="Daily Vehicles"/>
                    <Tab label="Available Bill Hour Capacity" value="1" key="Available Bill Hour Capacity"/>
                </TabList>
                <TabPanel style={{width: "100%", padding: "24px 0"}} value="0" key="0">
                    <CapacityTechniciansTable selectedTab={selectedTab}/>
                </TabPanel>
                <TabPanel style={{width: "100%", padding: "24px 0"}} value="1" key="1">
                    <CapacityTechniciansTable selectedTab={selectedTab}/>
                </TabPanel>
            </TabContext>
        </div>
    );
};

export default CapacityTechnicians;