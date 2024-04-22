import React from 'react';
import {DemandWindows} from "./DemandWindows/DemandsWindows";
import {Box} from "@mui/material";
import PricingLevelsBy from "./PricingLevelsBy/PricingLevelsBy";

export const PricingLevels = () => {
    return <div>
        <DemandWindows/>
        <Box p={2} />
        <Box p={2} />
        <PricingLevelsBy/>
    </div>
};