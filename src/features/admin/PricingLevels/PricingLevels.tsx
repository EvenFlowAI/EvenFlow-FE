import React from 'react';
import {ConfigurationSettings} from "../TimeOfDayPricing/ConfigurationSettings/ConfigurationSettings";
import {Box} from "@mui/material";
import PricingLevelsBy from "./PricingLevelsBy/PricingLevelsBy";

export const PricingLevels = () => {
    return <div>
        <ConfigurationSettings/>
        <Box p={2} />
        <Box p={2} />
        <PricingLevelsBy/>
    </div>
};