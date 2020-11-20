import React from 'react';
import {Box} from "@material-ui/core";
import {ToD} from "./VariableDemand/ToD";

export const VariableDemand = () => {
    return <div>
        <ToD />
        <Box p={1.5} />
        <ToD />
    </div>
};