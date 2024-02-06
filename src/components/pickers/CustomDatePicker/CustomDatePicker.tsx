import {MobileDatePicker, MobileDatePickerProps} from "@mui/x-date-pickers";
import {TParsableDate} from "../../../types/types";
import {TextInputProps} from "../../formControls/types";
import React from "react";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";
import {pickersLayoutClasses} from "@mui/x-date-pickers/PickersLayout";

type TProps = MobileDatePickerProps<TParsableDate> & {
    fullWidth?: boolean;
    InputProps?: TextInputProps;
    label?: string;
}

export const CustomDatePicker: React.FC<TProps> = ({
                                                             fullWidth,
                                                             InputProps,
                                                             label,
                                                             ...props
                                                         }) => {
    const { classes  } = useDatePickerStyles();

    return <>
        {label ? <InputLabel shrink className={classes.label}>{label}</InputLabel> : null}
        <MobileDatePicker
            {...props}
            slotProps={{
                textField: {
                    fullWidth,
                    InputProps,
                },
                toolbar: {
                    toolbarFormat: "ddd, MMM DD",
                },
                day: {
                    sx: {
                        '&[aria-label:selected=true]': {
                            backgroundColor: '#7898FF',
                        }
                    }
                },
                layout: {
                    sx: {
                        [`.${pickersLayoutClasses.toolbar}`]: {
                            backgroundColor: '#7898FF',
                            color: "#FFFFFF"
                        },
                        [`.${pickersLayoutClasses.toolbar} > span`]: {
                            color: "#FFFFFF8A"
                        },
                    },
                },
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "&:hover > fieldset": {borderColor: "#C7C8CD"},
                    borderRadius: 0,
                    border: 0
                },
                "& .MuiOutlinedInput-input": {
                    padding: '9px'
                },
                "& .MuiPickersToolbar-root": {
                    backgroundColor: 'red'
                }
            }}
        />
    </>
};