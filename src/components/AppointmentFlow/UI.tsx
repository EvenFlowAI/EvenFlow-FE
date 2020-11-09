import React, {forwardRef} from "react";
import {TextFieldProps} from "@material-ui/core";
import {TextField as TF} from "../UI/EndUserInputs";
import {InputProps as StandardInputProps} from "@material-ui/core/Input/Input";

export const TextField: React.FC<TextFieldProps> = forwardRef((props, ref) => {
    return <TF ref={ref} fullWidth {...props} InputProps={{disableUnderline: true, ...props.InputProps} as Partial<StandardInputProps>} />;
});