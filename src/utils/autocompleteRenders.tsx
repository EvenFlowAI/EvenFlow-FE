import React from "react";
import {TextField} from "../components/formControls/TextFieldStyled/TextField";
import {Checkbox} from "@mui/material";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {TTextParams} from "./types";

// todo to find correct mui types for AutocompleteRenderOptionState and AutocompleteRenderInputParams

export const autocompleteRender = (props: TTextParams) => (params: any) => {
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

export const autocompleteOptionsRender = (label: (el: any) => string) => (option: any, params: any) => {
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