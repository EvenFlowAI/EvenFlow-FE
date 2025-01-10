import { DialogProps as DP } from "@mui/material";

type DialogData<U = {}> = {
  onClose: () => void;
  payload?: U;
  onAction?: () => void;
  width?: number;
};
export type DialogProps<U = {}> = DP & DialogData<U>;
export type TViewMode = { viewMode?: boolean };
