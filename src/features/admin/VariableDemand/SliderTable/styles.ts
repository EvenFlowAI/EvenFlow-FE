import { withStyles } from 'tss-react/mui';
import {ValueSlider} from "../../../../components/styled/ValueSlider";

export const ColorfulSlider = withStyles(ValueSlider, {
    root: {
        '&.Mui-disabled': {
            '& > .MuiSlider-track': {
                background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
            }
        },
    },
    track: {
        '&.Mui-disabled': {
            background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        },
        background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
    },
    rail: {
        background: "linear-gradient(90deg, green 0%, green 20%, orange 20%, orange 40%, red 40%)",
        opacity: 1
    },
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
