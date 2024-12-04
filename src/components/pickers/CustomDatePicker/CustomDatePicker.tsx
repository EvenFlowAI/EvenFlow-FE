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
    required?: boolean;
}

export const CustomDatePicker: React.FC<TProps> = ({
                                                       fullWidth,
                                                       InputProps,
                                                       label,
                                                       required,
                                                       ...props
                                                         }) => {
    const { classes  } = useDatePickerStyles();

    return <>
        {label ? <InputLabel shrink className={classes.label} required={required}>{label}</InputLabel> : null}
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
                            color: "#FFFFFF8A",
                            display: 'none',
                        },
                    },
                },
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    border: 0,
                    "&:hover > fieldset": {
                        borderColor: "#C7C8CD",
                    },
                },
                "& .MuiOutlinedInput-input": {
                    padding: '9px'
                },
                "& .MuiPickersToolbar-root": {
                    backgroundColor: 'red'
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: "#C7C8CD !important",
                    borderWidth: "1px !important"
                },
                '& .Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: "#FF0000 !important",
                    borderWidth: "1px !important"
                },
            }}
        />
    </>
};