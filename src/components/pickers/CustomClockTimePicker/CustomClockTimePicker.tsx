import React from 'react';
import dayjs, {Dayjs} from "dayjs";
import {FieldChangeHandlerContext} from "@mui/x-date-pickers/internals";
import {TextInputProps} from "../../formControls/types";
import {MobileTimePicker} from "@mui/x-date-pickers";
import {useDatePickerStyles} from "../../../hooks/styling/useDatePickerStyles";
import {InputLabel} from "@mui/material";
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

type TProps = {
    value: Dayjs|null;
    onChange:(value: Dayjs|null, context?: FieldChangeHandlerContext<any>) => void;
    fullWidth: boolean;
    InputProps:TextInputProps;
    label?: string;
}

const CustomClockTimePicker: React.FC<TProps> = ({value, onChange, fullWidth, InputProps, label}) => {
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
            }}/>
    </>
};

export default CustomClockTimePicker;