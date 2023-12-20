import {TimePicker as TP, TimePickerProps} from "@material-ui/pickers";
import {useDatePickerStyles} from "../../commonStyles/useDatePickerStyles";
import {InputLabel} from "@material-ui/core";
import React from "react";

export const TimePicker = ({label, ...props}: TimePickerProps) => {
    const classes = useDatePickerStyles();
    if (!label) return <TP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <TP {...props} />
    </>
}