import React, {forwardRef} from "react";
import {TextFieldProps} from "@mui/material";
import {TextField as TF} from "../../styled/EndUserInputs";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";

export const TextField: React.FC<TextFieldProps> = forwardRef((props, ref) => {
    return <TF ref={ref} fullWidth {...props} InputProps={{disableUnderline: true, ...props.InputProps} as Partial<StandardInputProps>} />;
});