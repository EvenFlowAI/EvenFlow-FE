import {InputBaseProps} from "@mui/material/InputBase/InputBase";
import {AutocompleteRenderInputParams} from "@mui/material/Autocomplete/Autocomplete";

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