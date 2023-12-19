import {withStyles} from "@material-ui/core";
import {ValueSlider} from "../styled/ValueSlider";

export const AncillaryPriceSlider = withStyles((theme) => ({
    rail: {
        background: "#3261FB",
        opacity: 1
    },
    track: {
        background: "transparent",
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
        width: 18,
        height: 18,
        background: "#3261FB",
        border: '2px solid #FFFFFF',
        marginTop: -7,
    },
    valueLabel: {
        top: -20,
        left: -8,
        transition: theme.transitions.create(["box-shadow"]),
        '&:focus, &:hover, &:active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
            },
        },
        "&>span": {
            boxShadow: "1px 4px 10px rgba(0, 44, 131, 0.3)",
            width: 'fit-content',
            height: 22,
            transform: "none",
            padding: 6,
            "&>span": {
                transform: "none",
                color: theme.palette.text.primary,
            },
        }
    }
}))(ValueSlider);