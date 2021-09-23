import React, {forwardRef} from 'react';
import {InputBase as DefaultTextField, InputLabel} from "@material-ui/core";
import {InputBaseProps} from "@material-ui/core/InputBase/InputBase";
import theme from "../../theme/theme";
import {makeStyles} from "@material-ui/core/styles";
import {AutocompleteRenderInputParams} from "@material-ui/lab";

export type TextInputProps = {
    label?: string,
    hideLabel?: boolean,
    spacing?: 'normal' | 'none' | undefined,
    params?: AutocompleteRenderInputParams
} & InputBaseProps;

type TStyleProps = {
    visible: boolean;
}
const useStyles = makeStyles(theme => ({
    label: ({visible}: TStyleProps) =>  ({
        textTransform: "uppercase",
        marginBottom: theme.spacing(.5),
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
        visibility: visible ? "visible" : "hidden",
    }),
    asterisk: ({visible}: TStyleProps) => ({
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
        visibility: visible ? "visible" : "hidden",
        fontSize: 24,
    })
}));

export const TextField = forwardRef<unknown, TextInputProps>(
    ({label, params, hideLabel, spacing, ...props}, ref) => {
    const classes = useStyles({visible: !hideLabel});
    const {InputProps={}, InputLabelProps={}, ...p} = params || {};

    return <>
        {label &&
            <InputLabel className={classes.label} shrink htmlFor={props.id} {...InputLabelProps}>
                {label}{props.required ? <span className={classes.asterisk}>&#42;</span> : ''}
            </InputLabel>
        }
        <DefaultTextField ref={ref} {...{...p, ...InputProps}} {...props} style={{marginBottom: spacing === 'normal' ? theme.spacing(2) : 0, ...props.style}} />
    </>
});