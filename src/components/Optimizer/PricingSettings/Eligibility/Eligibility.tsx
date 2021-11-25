import React from 'react';
import {DemandWindows} from "./DemandWindows";
import {Box} from "@material-ui/core";
import EligibilityStatuses from "./EligibilityStatuses";

export const Eligibility = () => {
    return <div>
        <DemandWindows />
        <Box p={2} />
        <EligibilityStatuses/>
    </div>
};