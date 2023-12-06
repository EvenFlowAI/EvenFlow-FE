import React from 'react';
import {DemandWindows} from "./DemandWindows/DemandsWindows";
import PricingDisplay from "./PricingDisplay/PricingDisplay";
import {Box} from "@material-ui/core";
import PricingLevelsBy from "./PricingLevelsBy/PricingLevelsBy";


export const PricingLevels = () => {
    return <div>
        <DemandWindows/>
        <Box p={2} />
        <PricingDisplay/>
        <Box p={2} />
        <PricingLevelsBy/>
    </div>
};