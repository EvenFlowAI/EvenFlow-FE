import React from 'react';
import {DemandWindows} from "./DemandsWindows";
import PricingDisplay from "./PricingDisplay";
import {Box} from "@material-ui/core";
import PricingLevelsByOpsCode from "./PricingLevelsByOpsCode";


export const PricingLevels = () => {
    return <div>
        <DemandWindows/>
        <Box p={2} />
        <PricingDisplay/>
        <Box p={2} />
        <PricingLevelsByOpsCode/>
    </div>
};