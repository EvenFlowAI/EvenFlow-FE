import React from "react";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";
import {TimePicker as TP} from "@mui/x-date-pickers";
// import {TimePickerProps} from '@mui/lab';
import {ParsableDate} from "../../../types/types";

//TimePickerProps<ParsableDate>

export const TimePicker = ({label, ...props}: any) => {
    const classes = useDatePickerStyles();
    if (!label) return <TP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <TP {...props} />
    </>
}