import {DialogProps as DP} from "@material-ui/core";

// type DialogPayload<U> = {
//     payload?: U;
// };
type DialogData = {
    onClose: () => void,
    width?: number
}
export type DialogProps = DP & DialogData;