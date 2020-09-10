import {Slider, SliderProps, Table, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

export const AppointmentTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            padding: 17,
            fontWeight: "bold",
        },
        "& .MuiTableCell-body": {
            padding: "33px 17px",
        },
        "& .MuiTableCell-root": {
            fontSize: 16,
            backgroundColor: "#FFFFFF"
        },
        "& .primary": {
            color: theme.palette.primary.main
        }
    }
}))(Table);

const useValueStyles = makeStyles(theme => ({
    valueLabel: {
        top: 5,
        "&>span": {
            background: "#FFFFFF",
            boxShadow: "1px 4px 10px rgba(0, 44, 131, 0.3)",
            borderRadius: 2,
            width: 27,
            height: 22,
            transform: "none",
            "&>span": {
                transform: "none",
                color: theme.palette.text.primary,
            }
        }
    }
}))

export const ValueSlider: React.FC<SliderProps> = props => {
    const classes = useValueStyles();
    return <Slider
        valueLabelDisplay="on"
        classes={classes}
        {...props}
    />;
}