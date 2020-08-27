import {DialogProps as DP} from "@material-ui/core";

// type DialogPayload<U> = {
//     payload?: U;
// };
type DialogData<U={}> = {
    onClose: () => void,
    payload?: Partial<U>,
    width?: number
}
export type DialogProps<U={}> = DP & DialogData<U>;