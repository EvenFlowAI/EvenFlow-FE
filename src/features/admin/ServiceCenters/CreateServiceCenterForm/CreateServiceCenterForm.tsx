import React from "react";
import { Autocomplete } from '@mui/material';
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Divider, Grid} from "@mui/material";
import {checkEmail, noop} from "../../../../utils/utils";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {TSelectChange} from "../../../../types/types";
import {TFormItem, TInputChange} from "../types";

type TModalFormProps<D> = {
    items: TFormItem<D>[][]
    values: D,
    onChange: TInputChange;
    onSelectChange?: (name: string) => TSelectChange;
    readOnly?: boolean;
    formIsChecked: boolean;
}

export const CreateServiceCenterForm = <Item extends {}>(props: TModalFormProps<Item>): JSX.Element => {
    return <form>
        {props.items.map((itemGroup, idx) =>
            <div key={idx}>
                {idx ? <Divider /> : null}
                <Grid container spacing={2}>
                    {itemGroup.map(item => {
                        const error = item.inputType === "number"
                            ? item.required && props.formIsChecked && (item.value(props.values).length < 11)
                            : item.inputType === "email"
                                ?item.required && props.formIsChecked && (!checkEmail(item.value(props.values)) || !item.value(props.values))
                                : item.required && props.formIsChecked && !item.value(props.values)

                           return <Grid item xs={item.xs || 12} sm={item.sm || 6} key={item.id}>
                                {!item.variant || item.variant === 'input'
                                    ? <TextField
                                        label={item.label}
                                        name={item.name || item.id}
                                        value={item.value(props.values)}
                                        onChange={props.onChange}
                                        disabled={props.readOnly}
                                        fullWidth
                                        {...item.inputProps}
                                        error={error}
                                    />
                                    : item.variant === 'select'
                                        ? <Autocomplete
                                            options={item.selectOptions || []}
                                            onChange={props?.onSelectChange ? props.onSelectChange(item.name || item.id) : noop}
                                            value={item.value(props.values) || null}
                                            disabled={props.readOnly}
                                            renderInput={autocompleteRender({
                                                label: item.label || "",
                                                error: item.required && props.formIsChecked && !item.value(props.values)
                                            })}
                                        />
                                        : null}
                            </Grid>
                        }
                    )}
                </Grid>
            </div>
        )}
    </form>;
}