import {withStyles} from "@material-ui/core";
import {ValueSlider} from "../../../components/styled/ValueSlider";

export const Slider = withStyles({
    rail: {
        background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
    track: {
        background: "transparent"
    }
})(ValueSlider);

export const InvertedSlider = withStyles({
    rail: {
        background: "linear-gradient(-90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
    track: {
        background: "transparent"
    }
})(ValueSlider);
