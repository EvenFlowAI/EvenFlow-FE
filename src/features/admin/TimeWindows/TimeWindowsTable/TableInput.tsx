import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';

export const InputOrValue: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<{
      name: string;
      value: number;
      onChange: React.ChangeEventHandler;
      isEdit: boolean;
    }>
  >
> = ({ name, value, isEdit, onChange }) => {
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));
  if (!isEdit) return <span>{value ? String(value) : '0'}</span>;
  return (
    <TextField
      name={name}
      value={value}
      type="number"
      style={{ minWidth: 80 }}
      inputProps={{
        min: 0,
      }}
      endAdornment={!isXS ? 'hour(s)' : undefined}
      onChange={onChange}
      id={name}
    />
  );
};
