import React from "react";
import {DateTimePicker as DTP, DateTimePickerProps} from "@material-ui/pickers";
import {InputLabel} from "@material-ui/core";
import {useDatePickerStyles} from "../../hooks/styling/useDatePickerStyles";

export const DateTimePicker = ({label, ...props}: DateTimePickerProps) => {
    const classes = useDatePickerStyles();
    if (!label) return <DTP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DTP {...props} />
    </>
}