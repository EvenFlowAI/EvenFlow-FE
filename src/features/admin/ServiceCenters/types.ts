import {GridSize} from "@material-ui/core";
import React from "react";
import {TextInputProps} from "../../../components/FormControls/types";

export type TSelectedGroup = {
    name: string;
    id: number;
}

export type TInputChange = (e: React.ChangeEvent<HTMLInputElement>) => void;

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
    selectOptions?: any;
    required?: boolean;
}