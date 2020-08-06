import {DialogProps as DP} from "@material-ui/core";

// type DialogPayload<U> = {
//     payload?: U;
// };
type DialogData = {
    onClose: () => void
}
export type DialogProps = DP & DialogData;