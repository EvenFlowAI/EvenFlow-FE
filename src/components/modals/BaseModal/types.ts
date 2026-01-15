import { DialogProps as DP } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type DialogData<U = {}> = {
  onClose: () => void;
  payload?: U;
  onAction?: () => void;
  width?: number;
};
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type DialogProps<U = {}> = DP & DialogData<U>;
export type TViewMode = { viewMode?: boolean };
