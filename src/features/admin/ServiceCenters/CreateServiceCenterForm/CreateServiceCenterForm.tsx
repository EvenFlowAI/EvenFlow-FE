import React from 'react';
import { Autocomplete } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { Divider, Grid } from '@mui/material';
import { checkEmail, noop } from '../../../../utils/utils';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { TSelectChange } from '../../../../types/types';
import { TFormItem, TInputChange } from '../types';

type TModalFormProps<D> = {
  items: TFormItem<D>[][];
  values: D;
  onChange: TInputChange;
  onSelectChange?: (name: string) => TSelectChange;
  readOnly?: boolean;
  formIsChecked: boolean;
};

const getItemName = <Item extends object>(item: TFormItem<Item>): string => item.name || item.id;

const getFieldError = <Item extends object>(
  item: TFormItem<Item>,
  value: string,
  formIsChecked: boolean
): boolean => {
  if (!item.required || !formIsChecked) {
    return false;
  }

  if (item.inputType === 'number') {
    return value.length < 11;
  }

  if (item.inputType === 'email') {
    return !value || !checkEmail(value.trim());
  }

  return !value;
};

const renderField = <Item extends object>(
  item: TFormItem<Item>,
  value: string,
  error: boolean,
  props: TModalFormProps<Item>
): JSX.Element | null => {
  const name = getItemName(item);

  if (!item.variant || item.variant === 'input') {
    return (
      <TextField
        placeholder={item.label}
        label={item.label}
        name={name}
        value={value}
        onChange={props.onChange}
        disabled={props.readOnly}
        fullWidth
        {...item.inputProps}
        error={error}
      />
    );
  }

  if (item.variant === 'select') {
    return (
      <Autocomplete
        options={item.selectOptions || []}
        onChange={props?.onSelectChange ? props.onSelectChange(name) : noop}
        value={value || null}
        disabled={props.readOnly}
        renderInput={autocompleteRender({
          label: item.label || '',
          error: item.required && props.formIsChecked && !value,
          placeholder: item.label,
        })}
      />
    );
  }

  return null;
};

export const CreateServiceCenterForm = <Item extends object>(
  props: TModalFormProps<Item>
): JSX.Element => {
  return (
    <form>
      {props.items.map((itemGroup, idx) => (
        <div key={idx}>
          {idx ? <Divider /> : null}
          <Grid container spacing={2}>
            {itemGroup.map(item => {
              const value = item.value(props.values);
              const error = getFieldError(item, value, props.formIsChecked);

              return (
                <Grid item xs={item.xs || 12} sm={item.sm || 6} key={item.id}>
                  {renderField(item, value, error, props)}
                </Grid>
              );
            })}
          </Grid>
        </div>
      ))}
    </form>
  );
};
