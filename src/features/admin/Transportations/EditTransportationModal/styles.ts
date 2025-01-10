import { makeStyles } from "tss-react/mui";

//
export const useMultipleACStyles = makeStyles()(() => ({
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
    padding: 5,
    paddingRight: 8,
  },
}));

//
export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 48px",
  },
  input: {
    marginBottom: 20,
  },
  smallWrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  bigLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  actionsWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: 14,
  },
  buttonsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    color: "#9FA2B4",
    marginRight: 20,
    border: "none",
    outline: "none",
  },
  saveButton: {
    background: "#7898FF",
    color: "white",
    border: "1px solid #7898FF",
    outline: "none",
    "&:hover": {
      color: "#7898FF",
    },
  },
}));

//
export const useAutocompleteStyles = makeStyles()(() => ({
  clearIndicator: {
    width: 0,
  },
}));
