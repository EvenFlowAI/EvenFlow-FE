import React from 'react';
import {InputBase as DefaultTextField, withStyles, InputLabel} from "@material-ui/core";
import {InputBaseProps} from "@material-ui/core/InputBase/InputBase";
import theme from "../../theme";

type TextInputProps = {label?: string, spacing?: 'normal' | 'none' | undefined} & InputBaseProps;

const StyledLabel = withStyles(theme => ({
    root: {
        textTransform: "uppercase",
        marginBottom: theme.spacing(.5),
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary
    }
}))(InputLabel)

export const TextField = ({label, spacing, ...props}: TextInputProps) => {
    return <>
        {label &&
            <StyledLabel shrink htmlFor={props.id}>
                {label}
            </StyledLabel>
        }
        <DefaultTextField {...props} style={{marginBottom: spacing === 'normal' ? theme.spacing(2) : 0 }} />
    </>
}