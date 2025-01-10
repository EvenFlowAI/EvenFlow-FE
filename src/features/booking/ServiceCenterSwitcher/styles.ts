import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()((theme) => ({
  selectWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    padding: "12px 0 28px 0",
    [theme.breakpoints.down("mdl")]: {
      justifyContent: "center",
      marginBottom: 8,
      padding: "12px 0 0 0",
    },
  },
  textWrapper: {
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
    [theme.breakpoints.down("md")]: {
      fontSize: 16,
    },
  },
}));
