import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {},
  },
  itemWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "white",
    border: "1px solid #DADADA",
    fontSize: 18,
    [theme.breakpoints.down("md")]: {
      padding: "24px 16px",
    },
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    color: "#252525",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));
