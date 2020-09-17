import React from "react";
import {AutocompleteRenderInputParams} from "@material-ui/lab";
import {TextField} from "./TextField";
import {Checkbox} from "@material-ui/core";
import {AutocompleteRenderOptionState} from "@material-ui/lab/Autocomplete/Autocomplete";
import {CheckBox, CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";

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
                   startAdornment={params.InputProps.startAdornment}
                   endAdornment={params.InputProps.endAdornment}/>
    </div>
}
export const autocompleteOptionsRender = (label: (el: any) => string) => (option: any, params: AutocompleteRenderOptionState) => {
    return <>
        <Checkbox
            size="small"
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBoxOutlined fontSize="small" color="primary" />}
            style={{marginRight: 8}}
            checked={params.selected}
        />
        {label(option)}
    </>;
}