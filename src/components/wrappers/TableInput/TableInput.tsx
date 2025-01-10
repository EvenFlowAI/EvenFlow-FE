import React, { ReactElement } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { TextField } from "../../formControls/TextFieldStyled/TextField";

export const TableInput: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<{
      name: string;
      value: number | string;
      onChange: React.ChangeEventHandler;
      isEdit: boolean;
      endAdornment?: string | ReactElement;
      defaultValue?: string;
      type?: string;
      disabled?: boolean;
      error?: boolean;
    }>
  >
> = ({
  name,
  value,
  isEdit,
  onChange,
  endAdornment,
  defaultValue,
  type,
  disabled,
  error,
}) => {
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isEdit)
    return (
      <span>{value ? String(value) : defaultValue ? defaultValue : "0"}</span>
    );
  return (
    <TextField
      name={name}
      value={value}
      type={type ?? "number"}
      style={{ minWidth: 80 }}
      inputProps={{
        min: 0,
      }}
      error={error}
      disabled={disabled}
      endAdornment={!isXS ? endAdornment : undefined}
      onChange={onChange}
      id={name}
    />
  );
};
