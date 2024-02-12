import React, {forwardRef} from 'react';
import {InputBase as DefaultTextField} from "@mui/material";
import theme from "../../../theme/theme";
import {TextInputProps} from "../types";
import {Label} from "./styles";

export const TextField = forwardRef<unknown, TextInputProps>(
    ({label, params, hideLabel, spacing, isLowerCase, ...props}, ref) => {
    const {InputProps={}, InputLabelProps={}, ...p} = params || {};

    return <>
        {label &&
            <Label
                shrink
                htmlFor={props.id}
                {...InputLabelProps}
                visible={Boolean(!hideLabel)}
                lowerCase={Boolean(isLowerCase)}>
                {label}{props.required ? <span>&#42;</span> : ''}
            </Label>
        }
        <DefaultTextField ref={ref} {...{...p, ...InputProps}} {...props} style={{marginBottom: spacing === 'normal' ? theme.spacing(2) : 0, ...props.style}} />
    </>
});