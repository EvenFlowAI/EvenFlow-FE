import React, {useState} from 'react';
import {TabContext, TabPanel} from "@mui/lab";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {capacityManagementRoot} from "../../../utils/constants";
import {TabList} from "../../../components/styled/Tabs";
import {Tab} from "@mui/material";
import {TimeOfDayDesirability} from "../../../features/admin/TimeOfDayDesirability/TimeOfDayDesirability";
import SearchWindows from "../../../features/admin/SearchWindows/SearchWindows";
import TimeWindows from "../../../features/admin/TimeWindows/TimeWindows";
import {useException} from "../../../hooks/useException/useException";
import {useMessage} from "../../../hooks/useMessage/useMessage";
import {recalculateCapacity} from "../../../store/reducers/demandSegments/actions";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {RootState} from "../../../store/rootReducer";
import {ButtonContainer} from "./styles";

type TTab = {
    id: string;
    label: string;
    component: JSX.Element
}

const tabs: TTab[] = [
    {id: "0", label: "Time Of Day Desirability", component: <TimeOfDayDesirability />},
    {id: "1", label: "Search Windows", component: <SearchWindows/> },
    {id: "2", label: "Time Windows", component: <TimeWindows/>},
]

const TimeDifferentiation = () => {
    const {isRecalculationLoading} = useSelector((state: RootState) => state.demandSegments);
    const [selectedTab, selectTab] = useState<string>("0");
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    const handleTabChange = (e: any, value: string) => {
        selectTab(value);
    }

    const onSuccess = () => {
        showMessage('Capacity recalculated')
    }

    const recalculate = () => {
        if (selectedSC) dispatch(recalculateCapacity(selectedSC.id, onSuccess, showError))
    }

    return <TabContext value={selectedTab}>
        <TitleContainer
            title="Time Differentiation"
            pad
            parent={capacityManagementRoot}/>
        <ButtonContainer>
            <LoadingButton
                loading={isRecalculationLoading}
                variant="outlined"
                color="primary"
                onClick={recalculate}>
                Recalculate Capacity
            </LoadingButton>
        </ButtonContainer>
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
                style={{width: "100%", padding: "24px 0"}}
                key={t.id}
                value={t.id}>
                {t.component}
            </TabPanel>
        })}
    </TabContext>
};

export default TimeDifferentiation;