import React from "react";
import {
    DateTimePickerProps,
    TimePicker as TP,
    DatePicker as DP,
    DateTimePicker as DTP,
    TimePickerProps,
    DatePickerProps
} from "@material-ui/pickers";
import {InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    label: {
        textTransform: "uppercase",
        marginBottom: theme.spacing(.5),
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
    }
}));

export const TimePicker = ({label, ...props}: TimePickerProps) => {
    const classes = useStyles();
    if (!label) return <TP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <TP {...props} />
    </>
}
export const DatePicker = ({label, ...props}: DatePickerProps) => {
    const classes = useStyles();
    if (!label) return <DP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DP {...props} />
    </>;
}
export const DateTimePicker = ({label, ...props}: DateTimePickerProps) => {
    const classes = useStyles();
    if (!label) return <DTP {...props} />;
    return <>
        <InputLabel shrink className={classes.label}>{label}</InputLabel>
        <DTP {...props} />
    </>
}