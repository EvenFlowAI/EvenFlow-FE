import React from "react";
import {TextField} from "../components/formControls/TextFieldStyled/TextField";
import {Checkbox} from "@mui/material";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {TTextParams} from "./types";
import {AutocompleteRenderInputParams, AutocompleteRenderOptionState} from "@mui/material/Autocomplete/Autocomplete";

export const autocompleteRender = (props: TTextParams) => (params: AutocompleteRenderInputParams) => {
    return <TextField
        label={props.label}
        name={"undefined-name"}
        params={params}
        error={props.error}
        placeholder={props.placeholder}
        required={props.required}
        key={props.key}
    />;
}

export const autocompleteOptionsRender = (label: (el: any) => string) => (props: React.HTMLAttributes<HTMLLIElement>, option: any, state: AutocompleteRenderOptionState) => {
    return <li style={{display: 'flex', alignItems: 'center'}} key={option + new Date()} {...props}>
        <Checkbox
            size="small"
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBoxOutlined fontSize="small" color="primary" />}
            style={{marginRight: 8, padding: 0}}
            checked={state.selected}
        />
        {label(option)}
    </li>;
}