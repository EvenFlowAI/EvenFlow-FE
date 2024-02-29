import React, {forwardRef} from "react";
import {TextFieldProps} from "@mui/material";
import {TextField as TF} from "../../styled/EndUserInputs";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";

export const TextField: React.FC<React.PropsWithChildren<React.PropsWithChildren<TextFieldProps>>> = forwardRef((props, ref) => {
    return <TF ref={ref} fullWidth {...props} InputProps={{...props.InputProps} as Partial<StandardInputProps>} variant={"standard" as any}/>;
});