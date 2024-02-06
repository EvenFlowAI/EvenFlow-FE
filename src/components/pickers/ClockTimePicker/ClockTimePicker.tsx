import React from 'react';
import {TextInputProps} from "../../formControls/types";
import {MobileTimePicker, MobileTimePickerProps} from "@mui/x-date-pickers";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";
import {TParsableDate} from "../../../types/types";
import {pickersLayoutClasses} from "@mui/x-date-pickers/PickersLayout";

type TProps = MobileTimePickerProps<TParsableDate> & {
    fullWidth?: boolean;
    InputProps?:TextInputProps;
    label?: string;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean,
    id?: string;
    name?: string;
}

const ClockTimePicker: React.FC<TProps> = ({
                                                    value,
                                                    onChange,
                                                    fullWidth,
                                                    InputProps,
                                                    label,
                                                     placeholder,
                                                     error,
                                                     disabled,
                                                     id,
                                                     name,
                                                     ...props
                                                }) => {
    const { classes  } = useDatePickerStyles();

    return <>
        {label ? <InputLabel shrink className={classes.label}>{label}</InputLabel> : null}
        <MobileTimePicker
            {...props}
            value={value}
            onChange={onChange}
            slotProps={{
                textField: {
                    fullWidth,
                    InputProps: {
                        ...InputProps,
                        placeholder: InputProps?.placeholder ?? placeholder,
                        error: InputProps?.error ?? error,
                        disabled: InputProps?.disabled ?? disabled,
                        id: InputProps?.id ?? id,
                        name: InputProps?.name ?? name
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
            }}
        />
    </>
};

export default ClockTimePicker;