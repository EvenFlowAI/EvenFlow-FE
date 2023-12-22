import React, {forwardRef} from 'react';
import {InputBase as DefaultTextField, InputLabel} from "@material-ui/core";
import theme from "../../../theme/theme";
import {TextInputProps} from "../types";
import {useStyles} from "./styles";

export const TextField = forwardRef<unknown, TextInputProps>(
    ({label, params, hideLabel, spacing, isLowerCase, ...props}, ref) => {
    const classes = useStyles({visible: !hideLabel, lowerCase: isLowerCase});
    const {InputProps={}, InputLabelProps={}, ...p} = params || {};

    return <>
        {label &&
            <InputLabel className={classes.label} shrink htmlFor={props.id} {...InputLabelProps}>
                {label}{props.required ? <span>&#42;</span> : ''}
            </InputLabel>
        }
        <DefaultTextField ref={ref} {...{...p, ...InputProps}} {...props} style={{marginBottom: spacing === 'normal' ? theme.spacing(2) : 0, ...props.style}} />
    </>
});