import React from "react";
import {AutocompleteRenderInputParams} from "@material-ui/lab";
import {TextField} from "./TextField";

type TTextParams = {
    label: string;
    fullWidth?: boolean
};
export const autocompleteRender = (props: TTextParams) => (params: AutocompleteRenderInputParams) => {
    return <div ref={params.InputProps.ref}>
        <TextField label={props.label}
                   {...params.inputProps}
                   autoComplete={"off-invalid-value"}
                   fullWidth={props.fullWidth}
                   endAdornment={params.InputProps.endAdornment}/>
    </div>
}