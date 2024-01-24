import React from 'react';
import dayjs from "dayjs";
import {TextInputProps} from "../../formControls/types";
import {MobileTimePicker, MobileTimePickerProps} from "@mui/x-date-pickers";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {TParsableDate} from "../../../types/types";

dayjs.extend(customParseFormat)

type TProps = MobileTimePickerProps<TParsableDate> & {
    fullWidth: boolean;
    InputProps:TextInputProps;
    label?: string;
}

const CustomClockTimePicker: React.FC<TProps> = ({
                                                    value,
                                                    onChange,
                                                    fullWidth,
                                                    InputProps,
                                                    label,
                                                }) => {
    const classes = useDatePickerStyles();

    return <>
        {label ? <InputLabel shrink className={classes.label}>{label}</InputLabel> : null}
        <MobileTimePicker
            value={value}
            onChange={onChange}
            slotProps={{
                textField: {
                    fullWidth,
                    InputProps
                }
            }}
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

export default CustomClockTimePicker;