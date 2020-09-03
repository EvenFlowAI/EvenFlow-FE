import React from "react";
import {TimePicker as TP, TimePickerProps} from "@material-ui/pickers";

export const TimePicker = (props: TimePickerProps) => {
    return <TP {...props} />
}