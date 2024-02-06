import { withStyles } from 'tss-react/mui';
import {ValueSlider} from "../../../../components/styled/ValueSlider";

export const Slider = withStyles(ValueSlider, {
    rail: {
        background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
    track: {
        background: "transparent"
    }
});

export const InvertedSlider = withStyles(ValueSlider, {
    rail: {
        background: "linear-gradient(-90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
    track: {
        background: "transparent"
    }
});
