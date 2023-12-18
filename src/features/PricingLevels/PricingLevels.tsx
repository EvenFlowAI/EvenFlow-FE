import React from 'react';
import {DemandWindows} from "./DemandsWindows";
import PricingDisplay from "./PricingDisplay";
import {Box} from "@material-ui/core";
import PricingLevelsBy from "./PricingLevelsBy";


export const PricingLevels = () => {
    return <div>
        <DemandWindows/>
        <Box p={2} />
        <PricingDisplay/>
        <Box p={2} />
        <PricingLevelsBy/>
    </div>
};