import { withStyles } from 'tss-react/mui';
import {ValueSlider} from "./ValueSlider";

export const AncillaryPriceSlider = withStyles(ValueSlider, (theme) => ({
    rail: {
        background: "#B8B9BF",
        opacity: 1
    },
    track: {
        background: "#7898FF",
    },
    mark: {
        height: 4,
        width: 1,
    },
    markLabel: {
        top: 25,
        color: "#9FA2B4",
        fontWeight: 'bold',
        fontSize: 12,
    },
    thumb: {
        width: 22,
        height: 22,
        background: "#7898FF",
        border: '3px solid #FFFFFF',
        '&:hover': {
            width: 22,
            height: 22,
            background: "#7898FF",
            border: '3px solid #FFFFFF',
        }
    },
    valueLabel: {
        top: -2,
        left: -22,
        transition: theme.transitions.create(["box-shadow"]),
        '&:focus, &:hover, &:active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
            },
        },
        "&>span": {
            width: 'fit-content',
            height: 22,
            boxShadow: "1px 4px 10px rgba(0, 44, 131, 0.3)",
            padding: 6,
            transform: "none",
            lineHeight: '12px',
            "&>span": {
                transform: "none",
                color: theme.palette.text.primary,
            },
        }
    }
}));