import { makeStyles } from "tss-react/mui";
import { lighten } from "@mui/material";

//
export const useStyles = makeStyles()((theme) => ({
  listItem: {
    color: "#FFFFFF",
    textTransform: "uppercase",
    fontSize: 14,
    padding: "16px 0",
    lineHeight: "17px",
    fontWeight: "bold",
    transition: theme.transitions.create(["color"]),
    "&.active": {
      color: "#7898FF",
    },
    "&:hover": {
      color: lighten("#7898FF", 0.5),
    },
  },
  subMenu: {
    color: "#929292",
    padding: "10px 0 10px 15px",
    textTransform: "none",
  },
  expandIcon: {
    top: 28,
    right: -30,
    cursor: "pointer",
  },
  listWithSubs: {
    transition: theme.transitions.create(["color"]),
    "&.active": {
      color: "#7898FF",
    },
    "&:hover": {
      color: lighten("#7898FF", 0.5),
    },
  },
  mainListItem: {
    "&.active": {
      color: "#FFFFFF",
    },
  },
}));
