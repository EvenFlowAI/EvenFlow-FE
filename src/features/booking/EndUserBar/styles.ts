import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()((theme) => ({
  grow: {
    flexGrow: 1,
  },
  contacts: {
    fontSize: 19,
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  serviceName: {
    marginLeft: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 19,
  },
  bar: {
    background: "#252733",
  },
}));
