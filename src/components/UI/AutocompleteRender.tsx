import React from "react";
import {Autocomplete, AutocompleteProps, AutocompleteRenderInputParams} from "@material-ui/lab";
import {TextField} from "./TextField";
import {Checkbox} from "@material-ui/core";
import {AutocompleteRenderOptionState} from "@material-ui/lab/Autocomplete/Autocomplete";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";

type TTextParams = {
    label: string;
    fullWidth?: boolean;
    disabled?: boolean;
};
export const autocompleteRender = (props: TTextParams) => (params: AutocompleteRenderInputParams) => {
    return <TextField
        label={props.label}
        name={"undefined-name"}
        params={params}
    />;
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

export const ASelect = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: IAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>&{label?: string}): JSX.Element => {
    return <Autocomplete
        {...props}
        renderInput={ params =>
            <TextField
                label={props.label}
                ref={params.InputProps.ref}
                {...params.inputProps}
                autoComplete={"off-invalid-value"}
                fullWidth={props.fullWidth}
                startAdornment={params.InputProps.startAdornment}
                endAdornment={params.InputProps.endAdornment}
            />
        }
    />;
}

declare interface IAutocompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> {
    label?: string;
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
}

export const ASelectMulti = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: IAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>&{label?: string}): JSX.Element => {
    return <ASelect
        ChipProps={{
            color: "primary",
            style: {borderRadius: 4},
            size: "small"
        }}
        disableCloseOnSelect
        renderOption={(option, state) =>
            <>
                <Checkbox
                    size="small"
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBoxOutlined fontSize="small" color="primary" />}
                    style={{marginRight: 8}}
                    checked={state.selected}
                />
                {props.getOptionLabel ? props.getOptionLabel(option) : String(option)}
            </>
        }
        {...props} />
}