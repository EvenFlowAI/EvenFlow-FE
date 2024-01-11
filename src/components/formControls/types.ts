import {AutocompleteRenderInputParams} from "@mui/lab";
import {InputBaseProps} from "@mui/material/InputBase/InputBase";

export interface IIconState {
    file: File | null;
    dataUrl?: string;
}

export type TextInputProps = {
    label?: string,
    hideLabel?: boolean,
    spacing?: 'normal' | 'none' | undefined,
    params?: AutocompleteRenderInputParams,
    isLowerCase?: boolean,
} & InputBaseProps;