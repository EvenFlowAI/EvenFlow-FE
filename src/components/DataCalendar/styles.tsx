import { makeStyles } from 'tss-react/mui';
import {lighten} from "@mui/material";

export const useStyles = makeStyles()(theme => ({
    title: {
        textAlign: "center",
        position: "absolute",
        top: 8,
        left: 0,
        right: 0,
        margin: 0,
        [theme.breakpoints.down('sm')]: {
            position: "static",
            marginBottom: theme.spacing(1)
        }
    },
    paper: {
        borderRadius: 0,
        position: "relative",
        padding: 11,
        color: "#252733"
    },
    weekDay: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.2,
        textTransform: 'uppercase',
        textAlign: "center",
        background: theme.palette.common.white,
        padding: '4px 0',
        borderBottom: '1px solid #B8B9BF',
    },
    dayNumber: {
        position: "absolute",
        top: 4,
        left: 4,
        fontSize: 12,
        fontWeight: 700,
        color: "#7898FF",
    },
    prevMonth: {
        color: theme.palette.text.secondary,
        "& svg, & > span": {
            color: '#B8B9BF !important',
        },
    },
    dayCell: {
        background: theme.palette.common.white,
        minHeight: 54,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 24px",
        transition: theme.transitions.create(["background"]),
    },
    iconBlock: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        margin: 3,
        "&>.MuiSvgIcon-root": {
            fontSize: 20,
        }
    },
    today: {
        color: `${theme.palette.success.dark} !important`,
        "& svg:hover, & > span": {
            color: `${theme.palette.success.dark} !important`,
        }
    },
    currentMonth: {
        color: theme.palette.text.primary,
        cursor: "pointer",
        "&:hover": {
            background: lighten(theme.palette.primary.light, .9),
            color: '#7898FF',
        },
        "& svg:hover": {
            color: '#7898FF',
        }
    },
    calendarWrapper: {
        marginTop: 11,
        overflowX: "auto",
        gap: 1,
        background: theme.palette.divider,
        border: `1px solid #B8B9BF`,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)"
    }
}));