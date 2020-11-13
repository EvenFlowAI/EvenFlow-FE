import React, {forwardRef} from "react";
import {FormLabel, TextFieldProps, withStyles} from "@material-ui/core";
import {TextField as TF} from "../UI/EndUserInputs";
import {InputProps as StandardInputProps} from "@material-ui/core/Input/Input";

export const TextField: React.FC<TextFieldProps> = forwardRef((props, ref) => {
    return <TF ref={ref} fullWidth {...props} InputProps={{disableUnderline: true, ...props.InputProps} as Partial<StandardInputProps>} />;
});
export const Label = withStyles({
    root: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "right",
        textTransform: "uppercase",
        color: "#9FA2B4",
    }
})(FormLabel);

export type TStepProps = {
    next: () => void;
    prev: () => void;
}