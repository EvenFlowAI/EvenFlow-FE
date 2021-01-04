import {Slider, Table, withStyles} from "@material-ui/core";


export const AppointmentTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            padding: 17,
            fontWeight: "bold",
            [theme.breakpoints.down("xs")]: {
                fontSize: 14,
            }
        },
        "& .MuiTableCell-body": {
            padding: "33px 17px",
            [theme.breakpoints.down("xs")]: {
                padding: theme.spacing(1)
            }
        },
        "& .MuiTableCell-root": {
            fontSize: 16,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            [theme.breakpoints.down("xs")]: {
                fontSize: 14,
            }
        },
        "& .primary": {
            color: theme.palette.primary.main
        }
    }
}))(Table);

export const ValueSlider = withStyles(theme => ({
    track: {
        height: 4,
    },
    root: {
        height: 4,
    },
    rail: {
        height: 4
    },
    marked: {
        marginBottom: 0,
        marginTop: 20
    },
    mark: {
        height: 4,
        width: 1
    },
    markLabel: {
        top: -17,
    },
    thumb: {
        '&:focus, &:hover, &:active': {
            boxShadow: "none",
        },
    },
    valueLabel: {
        top: 5,
        left: -8,
        transition: theme.transitions.create(["box-shadow"]),
        '&:focus, &:hover, &:active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
            },
        },
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
}))(Slider);