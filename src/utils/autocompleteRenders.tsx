import React from "react";
import {AutocompleteRenderInputParams} from "@material-ui/lab";
import {TextField} from "../components/formControls/TextFieldStyled/TextField";
import {Checkbox} from "@material-ui/core";
import {AutocompleteRenderOptionState} from "@material-ui/lab/Autocomplete/Autocomplete";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {TTextParams} from "./types";

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

export const autocompleteOptionsRender = (label: (el: any) => string) => (option: any, params: AutocompleteRenderOptionState) => {
    return <>
        <Checkbox
            size="small"
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBoxOutlined fontSize="small" color="primary" />}
            style={{marginRight: 8, padding: 0}}
            checked={params.selected}
        />
        {label(option)}
    </>;
}

export const autocompleteOptionsCheckboxRender = (label: (el: any) => string) => (option: any, params: AutocompleteRenderOptionState) => {
    return <>
        <Checkbox
            color="primary"
            size="small"
            icon={params.selected
                ? <CheckBoxOutlined fontSize="small" htmlColor="#3855FE"/>
                : <CheckBoxOutlineBlank fontSize="small" htmlColor="#DADADA"/>}
            style={{marginRight: 8, padding: 0}}
            checked={params.selected}
        />
        {label(option)}
    </>;
}