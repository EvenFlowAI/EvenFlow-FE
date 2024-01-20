import React from "react";
import {DateTimePicker as DTP} from "@mui/x-date-pickers";
import {InputLabel} from "@mui/material";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
// import {DateTimePickerProps} from "@mui/lab";

//DateTimePickerProps<Date> & React.RefAttributes<HTMLDivElement>

export const CustomDateTimePicker = ({label, ...props}: any) => {
    const classes = useDatePickerStyles();
    if (!label) return <DTP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DTP {...props} />
    </>
}