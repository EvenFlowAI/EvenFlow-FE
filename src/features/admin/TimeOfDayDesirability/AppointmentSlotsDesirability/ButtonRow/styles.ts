import { makeStyles } from "tss-react/mui";

//
export const useStylesBR = makeStyles()((theme) => ({
  dataRow: {
    marginTop: 6,
    alignItems: "center",
  },
  time: {
    fontWeight: "bold",
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
    },
  },
  buttons: {
    textAlign: "right",
    paddingRight: 32,
    [theme.breakpoints.down("sm")]: {
      textAlign: "left",
      marginBottom: theme.spacing(1),
      display: "flex",
      flexFlow: "row nowrap",
      "&>button": {
        flexGrow: 1,
        flexBasis: 0,
      },
    },
  },
}));
