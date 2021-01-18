import React from "react";
import {Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason} from "@material-ui/lab";
import {TextField, TextInputProps} from "../UI/TextField";
import {Divider, Grid, GridSize} from "@material-ui/core";
import {noop} from "../../utils/utils";
import {autocompleteRender} from "../UI/AutocompleteRender";

export type TInputChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type TSelectChange = (
    e: React.ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
) => void;

export type TFormItem<DataType> = {
    label?: string;
    id: string;
    xs?: GridSize;
    sm?: GridSize;
    name?: string;
    value: (d: DataType) => string;
    inputType?: "email" | "password" | "number";
    variant?: "input" | "textarea" | "select"
    inputProps?: TextInputProps;
    selectOptions?: any
}
export type TModalFormProps<D> = {
    items: TFormItem<D>[][]
    values: D,
    onChange: TInputChange;
    onSelectChange?: (name: string) => TSelectChange;
}

export const ModalForm = <Item extends {}>(props: TModalFormProps<Item>): JSX.Element => {
    return <form>
        {props.items.map((itemGroup, idx) =>
            <div key={idx}>
                {idx ? <Divider /> : null}
                <Grid container spacing={2}>
                    {itemGroup.map(item =>
                        <Grid item xs={item.xs || 12} sm={item.sm || 6} key={item.id}>
                            {!item.variant || item.variant === 'input'
                                ? <TextField
                                    label={item.label}
                                    name={item.name || item.id}
                                    value={item.value(props.values)}
                                    onChange={props.onChange}
                                    fullWidth
                                    {...item.inputProps}
                                />
                                : item.variant === 'select'
                                    ? <Autocomplete
                                        options={item.selectOptions || []}
                                        onChange={props?.onSelectChange ? props.onSelectChange(item.name || item.id) : noop}
                                        value={item.value(props.values) || null}
                                        renderInput={autocompleteRender({label: item.label || ""})}
                                    />
                                    : null}
                        </Grid>
                    )}
                </Grid>
            </div>
        )}
    </form>;
}