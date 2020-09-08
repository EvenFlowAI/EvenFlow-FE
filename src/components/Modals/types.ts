import {DialogProps as DP} from "@material-ui/core";

type DialogData<U={}> = {
    onClose: () => void,
    payload?: U,
    onAction?: () => void,
    width?: number
}
export type DialogProps<U={}> = DP & DialogData<U>;