import React from 'react';
import {lighten, InputBase as DefaultTextField, withStyles, InputLabel} from "@material-ui/core";
import {InputBaseProps} from "@material-ui/core/InputBase/InputBase";

type TextInputProps = {label?: string} & InputBaseProps;

const defaultInputFontSize = 16;

const StyledLabel = withStyles(theme => ({
    root: {
        textTransform: "uppercase",
        fontSize: 14,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary
    }
}))(InputLabel)

const ExtendedInput = ({label, margin, ...props}: TextInputProps) => {
    return <>
        {label &&
            <StyledLabel shrink htmlFor={props.id}>
                {label}
            </StyledLabel>
        }
        <DefaultTextField {...props} />
    </>
}

export const TextField = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(.6),
        }
    },
    input: {
        borderRadius: 0,
        border: `1px solid ${theme.palette.grey.A200}`,
        padding: theme.spacing(2),
        backgroundColor: lighten(theme.palette.grey.A100, 0.7),
        fontWeight: "bold",
        fontSize: defaultInputFontSize,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
        //     boxShadow: `${fade(theme.palette.grey.A400, 0.25)} 0 0 0 0.2rem`,
            borderColor: lighten(theme.palette.grey.A400, 0.2),
        },
    }
}))(ExtendedInput);