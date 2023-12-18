import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import {TimeOfDay} from "./TimeOfDay/TimeOfDay";
import {DayOfWeek} from "./DayOfWeek/DayOfWeek";
import {useDispatch} from "react-redux";
import {useSCs} from "../../utils/hooks";
import {loadPricingDemand} from "../../store/reducers/pricingSettings/actions";
import {TimeOfYear} from "./TimeOfYear/TimeOfYear";
import DayOfWeekTabs from "./DayOfWeekTabs/DayOFWeekTabs";

export const VariableDemand = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPricingDemand(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    return <div>
        <TimeOfDay />
        <Box p={1.5} />
        <DayOfWeek />
        <Box p={1.5} />
        <TimeOfYear />
        <Box p={1.5} />
        <DayOfWeekTabs/>
    </div>
};