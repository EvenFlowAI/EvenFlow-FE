import { withStyles } from 'tss-react/mui';
import {ValueSlider} from "../../../../components/styled/ValueSlider";

export const ColorfulSlider = withStyles(ValueSlider, {
    root: {
        '&.Mui-disabled': {
            '& > .MuiSlider-track': {
                background: "linear-gradient(90deg, #5FA077 0%, #5FA077 20%, #FFA500 20%, #FFA500 40%, #F50057 40%)",
            }
        },
    },
    track: {
        '&.Mui-disabled': {
            background: "linear-gradient(90deg, #5FA077 0%, #5FA077 20%, #FFA500 20%, #FFA500 40%, #F50057 40%)",
        },
        background: "linear-gradient(90deg, #5FA077 0%, #5FA077 20%, #FFA500 20%, #FFA500 40%, #F50057 40%)",
    },
    rail: {
        background: "linear-gradient(90deg, #5FA077 0%, #5FA077 20%, #FFA500 20%, #FFA500 40%, #F50057 40%)",
        opacity: 1
    },
});

export const InvertedSlider = withStyles(ValueSlider, {
    root: {
        '&.Mui-disabled': {
            '& > .MuiSlider-track': {
                background: "linear-gradient(90deg, #F50057 0%, #F50057 60%, #FFA500 60%, #FFA500 80%, #5FA077 80%)",
            }
        },
    },
    track: {
        '&.Mui-disabled': {
            background: "linear-gradient(90deg, #F50057 0%, #F50057 60%, #FFA500 60%, #FFA500 80%, #5FA077 80%)",
        },
        background: "linear-gradient(90deg, #F50057 0%, #F50057 60%, #FFA500 60%, #FFA500 80%, #5FA077 80%)",
    },
    rail: {
        background: "linear-gradient(90deg, #F50057 0%, #F50057 60%, #FFA500 60%, #FFA500 80%, #5FA077 80%)",
        opacity: 1
    },
});
