import { makeStyles } from "tss-react/mui";
import { lighten } from "@mui/material";

export const useCalendarStyles = makeStyles()((theme) => ({
  title: {
    textAlign: "center",
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    margin: 0,
    fontSize: 16,
    [theme.breakpoints.down("sm")]: {
      position: "static",
      marginBottom: theme.spacing(1),
    },
  },
  paper: {
    borderRadius: 0,
    position: "relative",
    padding: 11,
  },
  weekDay: {
    textAlign: "center",
    background: theme.palette.common.white,
  },
  dayNumber: {
    position: "absolute",
    top: 4,
    left: 4,
  },
  prevMonth: {
    color: theme.palette.text.secondary,
  },
  dayCell: {
    background: theme.palette.common.white,
    minHeight: 70,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: theme.transitions.create(["background"]),
    "&:hover": {
      background: lighten(theme.palette.primary.light, 0.9),
    },
  },
  iconBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    margin: 3,
    "&>.MuiSvgIcon-root": {
      fontSize: 20,
    },
  },
  today: {
    color: `${theme.palette.success.dark} !important`,
  },
  currentMonth: {
    color: theme.palette.text.primary,
  },
  calendarWrapper: {
    marginTop: 11,
    overflowX: "auto",
    gap: 1,
    background: theme.palette.divider,
    border: `1px solid ${theme.palette.divider}`,
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
  },
}));
