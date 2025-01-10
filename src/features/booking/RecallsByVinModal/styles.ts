import { FormControlLabel, Switch } from "@mui/material";
import { withStyles } from "tss-react/mui";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  vinData: {
    fontSize: 20,
    marginBottom: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  title: {
    fontSize: 20,
    color: "#142EA1",
    textTransform: "uppercase",
  },
  serviceAddedBtn: {
    width: "45%",
    minWidth: "fit-content",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    textTransform: "uppercase",
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: 40,
      justifyContent: "space-between",
      "& > .MuiFormControlLabel-root": {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginRight: 0,
      },
    },
  },
  recallComponent: {
    fontSize: 16,
    color: "#828282",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  label: {
    fontWeight: 600,
    fontSize: 16,
  },
  data: {
    fontWeight: "normal",
    fontSize: 16,
  },
  status: {
    color: "red",
  },
  recallTitleWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: 9,
      marginBottom: 10,
    },
  },
  recallDetailsWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 20,
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
      gap: 6,
    },
  },
  textBox: {
    marginBottom: 20,
    fontSize: 16,
    lineHeight: "normal",
  },
  actionsWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    "& > button:not(:first-child)": {
      marginLeft: 20,
    },
  },
  iIcon: {
    position: "absolute",
    top: -5,
    right: -20,
  },
  button: {
    width: 144,
  },
  serviceAddedMobile: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 0,
    fontSize: 16,
  },
  mobileLabel: {
    position: "relative",
  },
}));

export const CustomSwitch = withStyles(Switch, {
  thumb: {
    color: "white",
    boxShadow:
      "0px 10px 20px rgba(0, 0, 0, 0.1), 0px 3px 4px rgba(0, 0, 0, 0.3)",
    border: "1px solid #DADADA",
  },
  track: {
    backgroundColor: "#D3D3D3",
  },
});

export const Label = withStyles(FormControlLabel, {
  root: {
    marginLeft: 0,
  },
  label: {
    fontWeight: "bold",
    position: "relative",
    marginRight: 20,
  },
});
