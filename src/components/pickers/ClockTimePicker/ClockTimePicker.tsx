import React from 'react';
import { TextInputProps } from '../../formControls/types';
import { MobileTimePicker, MobileTimePickerProps } from '@mui/x-date-pickers';
import { useDatePickerStyles } from '../../../hooks/styling/useDatePickerStyles';
import { InputLabel } from '@mui/material';
import { TParsableDate } from '../../../types/types';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';

type TProps = MobileTimePickerProps<TParsableDate> & {
  fullWidth?: boolean;
  InputProps?: TextInputProps;
  label?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  withClear?: boolean;
};

const ClockTimePicker: React.FC<TProps> = ({
  value,
  onChange,
  fullWidth,
  InputProps,
  label,
  placeholder,
  error,
  disabled,
  id,
  name,
  withClear,
  ...props
}) => {
  const { classes } = useDatePickerStyles();

  return (
    <>
      {label ? (
        <InputLabel shrink className={classes.label}>
          {label}
        </InputLabel>
      ) : null}
      <MobileTimePicker
        {...props}
        value={value}
        onChange={onChange}
        slotProps={{
          actionBar: {
            actions: withClear ? ['clear', 'cancel', 'accept'] : ['cancel', 'accept'],
          },
          textField: {
            fullWidth,
            variant: 'standard',
            InputProps: {
              ...InputProps,
              placeholder: InputProps?.placeholder ?? placeholder,
              error: InputProps?.error ?? error,
              disabled: InputProps?.disabled ?? disabled,
              id: InputProps?.id ?? id,
              name: InputProps?.name ?? name,
            },
          },
          layout: {
            sx: {
              [`.${pickersLayoutClasses.toolbar}`]: {
                backgroundColor: '#7898FF',
                color: '#FFFFFF',
                justifyContent: 'center',
              },
              [`.${pickersLayoutClasses.toolbar} > span`]: {
                color: '#FFFFFF8A',
                display: 'none',
              },
              [`.${pickersLayoutClasses.toolbar} `]: {
                color: '#FFFFFF8A',
              },
              '& .MuiPickersToolbarText-root': {
                color: '#FFFFFF8A',
              },
              '& .MuiTimePickerToolbar-hourMinuteLabel span': {
                fontSize: 60,
                fontWeight: 300,
              },
              '& .MuiPickersToolbarText-root.Mui-selected': {
                color: '#FFFFFF',
              },
              '& .MuiTimePickerToolbar-ampmLabel': {
                fontSize: 18,
              },
              '& .MuiTimePickerToolbar-ampmSelection': {
                marginRight: 0,
              },
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover > fieldset': { borderColor: '#C7C8CD' },
            borderRadius: 0,
            border: 0,
          },
          '& .ClockTimeTriggers': {
            paddingRight: '0 !important',
            '&::after': {
              display: 'none',
            },
            '&::before': {
              display: 'none',
            },
          },
        }}
      />
    </>
  );
};

export default ClockTimePicker;
