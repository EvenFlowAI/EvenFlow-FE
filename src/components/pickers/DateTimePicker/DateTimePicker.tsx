import React from "react";
import {DateTimePicker as DTP} from "@mui/x-date-pickers";
import {InputLabel} from "@mui/material";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {DateTimePickerProps} from "@mui/lab";

export const CustomDateTimePicker = ({label, ...props}: DateTimePickerProps<Date> & React.RefAttributes<HTMLDivElement>) => {
    const classes = useDatePickerStyles();
    if (!label) return <DTP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DTP {...props} />
    </>
}