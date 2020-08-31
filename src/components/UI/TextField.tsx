import React, {forwardRef} from 'react';
import {InputBase as DefaultTextField, InputLabel} from "@material-ui/core";
import {InputBaseProps} from "@material-ui/core/InputBase/InputBase";
import theme from "../../theme/theme";
import {makeStyles} from "@material-ui/core/styles";

export type TextInputProps = {label?: string, hideLabel?: boolean, spacing?: 'normal' | 'none' | undefined} & InputBaseProps;

const useStyles = makeStyles(theme => ({
    label: (visible: boolean) =>  ({
        textTransform: "uppercase",
        marginBottom: theme.spacing(.5),
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
        visibility: visible ? "visible" : "hidden",
    })
}));

export const TextField = forwardRef<unknown, TextInputProps>(
    ({label, hideLabel, spacing, ...props}, ref) => {
    const classes = useStyles(!hideLabel);
    return <>
        {label &&
            <InputLabel className={classes.label} shrink htmlFor={props.id}>
                {label}
            </InputLabel>
        }
        <DefaultTextField ref={ref} {...props} style={{marginBottom: spacing === 'normal' ? theme.spacing(2) : 0 }} />
    </>
});