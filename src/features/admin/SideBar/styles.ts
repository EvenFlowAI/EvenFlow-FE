import { makeStyles } from "tss-react/mui";
import { sideBarWidth } from "../../../theme/theme";

export const useStyles = makeStyles()((theme) => ({
  drawer: {
    flexShrink: 0,
    width: sideBarWidth,
    display: "flex",
    flexFlow: "column",
    position: "relative",
  },
  link: {
    color: "#fff",
    marginTop: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  logo: {
    maxWidth: "80%",
    marginBottom: 60,
    cursor: "pointer",
    transition: theme.transitions.create(["opacity"]),
    "&:hover": {
      opacity: 0.8,
    },
  },
  drawerPaper: {
    width: sideBarWidth,
    backgroundColor: "#252525",
    color: "#FFFFFF",
    display: "flex",
    flexFlow: "column",
    padding: "60px 30px",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));
