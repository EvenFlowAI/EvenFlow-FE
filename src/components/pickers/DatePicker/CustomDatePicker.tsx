import React from "react";
import {DatePicker as DP} from "@mui/x-date-pickers";
// import {DatePickerProps} from '@mui/lab';
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";
import {ParsableDate} from "../../../types/types";

// todo find correct props types
//DatePickerProps<ParsableDate>

export const CustomDatePicker = ({label, ...props}: any) => {
    const classes = useDatePickerStyles();
    if (!label) return <DP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DP {...props} />
    </>;
}