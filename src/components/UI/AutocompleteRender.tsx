import React from "react";
import {AutocompleteRenderInputParams} from "@material-ui/lab";
import {TextField} from "./TextField";

type TTextParams = {
    label: string;
};
export const autocompleteRender = (props: TTextParams) => (params: AutocompleteRenderInputParams) => {
    return <div ref={params.InputProps.ref}>
        <TextField label={props.label}
                   {...params.inputProps}
                   fullWidth
                   endAdornment={params.InputProps.endAdornment}/>
    </div>
}