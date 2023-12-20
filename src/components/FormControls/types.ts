import {AutocompleteRenderInputParams} from "@material-ui/lab";
import {InputBaseProps} from "@material-ui/core/InputBase/InputBase";

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