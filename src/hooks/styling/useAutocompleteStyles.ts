import { makeStyles } from "tss-react/mui";

export const useAutocompleteStyles = makeStyles()(() => ({
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
    height: "auto",
    maxHeight: "none",
    minHeight: 28,
    display: "flex",
    alignItems: "center",
    padding: 0,
    fontSize: 15,
  },
  inputRoot: {
    padding: 0,
    paddingRight: 8,
  },
}));
