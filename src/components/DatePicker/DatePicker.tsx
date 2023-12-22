import {DatePicker as DP, DatePickerProps} from "@material-ui/pickers";
import {useDatePickerStyles} from "../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@material-ui/core";
import React from "react";

export const DatePicker = ({label, ...props}: DatePickerProps) => {
    const classes = useDatePickerStyles();
    if (!label) return <DP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DP {...props} />
    </>;
}