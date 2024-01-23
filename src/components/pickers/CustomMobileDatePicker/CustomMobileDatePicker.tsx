import {MobileDatePicker, MobileDatePickerProps} from "@mui/x-date-pickers";
import {TParsableDate} from "../../../types/types";
import {TextInputProps} from "../../formControls/types";
import React from "react";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";

type TProps = MobileDatePickerProps<TParsableDate> & {
    fullWidth?: boolean;
    InputProps?: TextInputProps;
    label?: string;
}

export const CustomMobileDatePicker: React.FC<TProps> = ({
                                                             fullWidth,
                                                             InputProps,
                                                             label,
                                                             ...props
                                                         }) => {
    const classes = useDatePickerStyles();

    return <>
        {label ? <InputLabel shrink className={classes.label}>{label}</InputLabel> : null}
        <MobileDatePicker
            {...props}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "&:hover > fieldset": {borderColor: "#C7C8CD"},
                    borderRadius: 0,
                    border: 0
                }
            }}
        />
    </>
};