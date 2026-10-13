import React, { forwardRef } from 'react';
import { FormHelperText, InputBase as DefaultTextField } from '@mui/material';
import theme from '../../../theme/theme';
import { TextInputProps } from '../types';

import { CustomInputLabel } from '../../styled/CustomInputLabel';

export const TextField = forwardRef<unknown, TextInputProps>(
  (
    {
      label,
      params,
      hideLabel,
      spacing,
      isLowerCase,
      labelFitContent,
      disabledLabelColor,
      ...props
    },
    ref
  ) => {
    const { InputProps = {}, InputLabelProps = {}, ...p } = params || {};
    const labelColor = props.disabled && disabledLabelColor ? disabledLabelColor : undefined;

    return (
      <>
        {label && (
          <CustomInputLabel
            shrink
            style={{
              ...(labelFitContent ? { width: 'fit-content' } : {}),
              ...(labelColor ? { color: labelColor } : {}),
            }}
            htmlFor={props.id}
            {...InputLabelProps}
            visible={Boolean(!hideLabel)}
            lowerCase={Boolean(isLowerCase)}
          >
            {label}
            {props.required ? <span>&#42;</span> : ''}
          </CustomInputLabel>
        )}
        <DefaultTextField
          ref={ref}
          {...{ ...p, ...InputProps }}
          {...props}
          style={{ marginBottom: spacing === 'normal' ? theme.spacing(2) : 0, ...props.style }}
        />
        {props.helperText && props.formIsChecked && (
          <FormHelperText style={{ fontSize: 14, color: '#F50057' }} error={props.error}>
            {props.helperText}
          </FormHelperText>
        )}
      </>
    );
  }
);
