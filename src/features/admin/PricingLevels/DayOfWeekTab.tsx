import React from 'react';
import DayOfWeekTabs from "../VariableDemand/DayOfWeekTabs/DayOFWeekTabs";
import {DayOfWeek} from "../VariableDemand/DayOfWeek/DayOfWeek";
import {Box} from "@mui/material";

export const DayOfWeekTab = () => {
    return <div>
        <DayOfWeek/>
        <Box p={1.5}/>
        <DayOfWeekTabs/>
    </div>
};