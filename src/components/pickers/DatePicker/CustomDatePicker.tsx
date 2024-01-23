import React from "react";
import {DatePicker as DP} from "@mui/x-date-pickers";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";

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