import React, {ReactElement} from "react";
import {useMediaQuery, useTheme} from "@mui/material";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";

export const EditableTableCell: React.FC<React.PropsWithChildren<React.PropsWithChildren<{
    name: string;
    value: number|string;
    onChange: React.ChangeEventHandler
    isEdit: boolean;
    endAdornment?: string|ReactElement;
    defaultValue?: string;
    type?: string;
    disabled?: boolean;
}>>> = ({
            name,
            value,
            isEdit,
            onChange,
            endAdornment,
            defaultValue,
            type,
            disabled
        }) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));
    if (!isEdit) return <span>{value ? String(value) : defaultValue ? defaultValue :  "0"}</span>;
    return <TextField
        name={name}
        value={value}
        type={type ?? "number"}
        style={{
            minWidth: 80,
            border: disabled ? '1px solid #DADADA' : "1px solid #5E5F66",
            color: disabled ? "#DADADA" : "#5E5F66",
            opacity: disabled ? '0.5' : 'unset',
            borderRadius: 3}}
        inputProps={{
            min: 0
        }}
        disabled={disabled}
        endAdornment={!isXS ? endAdornment : undefined}
        onChange={onChange}
        id={name}
    />
}