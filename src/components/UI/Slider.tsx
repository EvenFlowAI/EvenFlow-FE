import {withStyles} from "@material-ui/core";
import {ValueSlider} from "../styled/ValueSlider";

export const Slider = withStyles({
    root: {
        margin: "0 25px",
        width: "calc(100% - 50px)"
    },
    markLabel: {
        top: 5,
        left: "-12px !important",
        "& ~ .MuiSlider-mark ~ .MuiSlider-markLabel": {
            left: "unset !important",
            right: -25
        }
    },
    valueLabel: {
        '& > span': {
            width: 57
        }
    }
})(ValueSlider);