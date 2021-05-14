import React from 'react';
import {DemandWindows} from "./DemandWindows";
import {ServiceCodes} from "./ServiceCodes";
import {Box} from "@material-ui/core";

export const Eligibility = () => {
    return <div>
        <DemandWindows />
        <Box p={2} />
        <ServiceCodes />
    </div>
};