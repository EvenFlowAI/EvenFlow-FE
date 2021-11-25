import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import {ToD} from "./VariableDemand/ToD";
import {DayOfWeek} from "./VariableDemand/DayOfWeek";
import {useDispatch} from "react-redux";
import {useSCs} from "../../../utils/hooks";
import {loadPricingDemand} from "../../../store/reducers/pricingSettings/actions";
import {TimeOfYear} from "./VariableDemand/TimeOfYear";
import DayOfWeekOpsCode from "./VariableDemand/DayOfWeekOpsCode";

export const VariableDemand = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPricingDemand(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    return <div>
        <ToD />
        <Box p={1.5} />
        <DayOfWeek />
        <Box p={1.5} />
        <TimeOfYear />
        <Box p={1.5} />
        <DayOfWeekOpsCode/>
    </div>
};