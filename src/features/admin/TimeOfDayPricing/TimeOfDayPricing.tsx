import React, {useEffect} from 'react';
import {Box} from "@mui/material";
import {TimeOfDayPricingRules} from "./TimeOfDayPricingRules/TimeOfDayPricingRules";
import {useDispatch} from "react-redux";
import {loadPricingDemand} from "../../../store/reducers/pricingSettings/actions";
import DayOfWeekTabs from "../VariableDemand/DayOfWeekTabs/DayOFWeekTabs";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {ConfigurationSettings} from "./ConfigurationSettings/ConfigurationSettings";

export const TimeOfDayPricing = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPricingDemand(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    return <div>
        <TimeOfDayPricingRules />
        <Box p={1.5} />
        <ConfigurationSettings />
        <Box p={1.5} />
        <DayOfWeekTabs/>
    </div>
};