import { makeStyles } from "tss-react/mui";

export const useMultipleAutocompleteStyles = makeStyles()(() => ({
  tag: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#7898FF",
    borderRadius: 4,
    color: "white",
    fontWeight: "bold",
    margin: "1px 2px",
    "& > svg": {
      color: "white",
    },
  },
  option: {
    padding: 0,
    fontSize: 15,
    height: 28,
  },
  inputRoot: {
    padding: 0,
    paddingRight: 0,
  },
}));

export const useStyles = makeStyles()(() => ({
  switchersTitle: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  switcher: {
    marginLeft: 0,
    "& > span": {
      fontWeight: "bold",
      textTransform: "uppercase",
      fontSize: 13,
    },
  },
}));
