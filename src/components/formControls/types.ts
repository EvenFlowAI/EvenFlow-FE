import { InputBaseProps } from '@mui/material/InputBase/InputBase';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete/Autocomplete';
import { Ref } from 'react';

export interface IIconState {
  file: File | null;
  dataUrl?: string;
}

export type TextInputProps = {
  ref?: Ref<HTMLInputElement>;
  label?: string;
  hideLabel?: boolean;
  spacing?: 'normal' | 'none' | undefined;
  params?: AutocompleteRenderInputParams;
  isLowerCase?: boolean;
  labelFitContent?: boolean;
} & InputBaseProps;
