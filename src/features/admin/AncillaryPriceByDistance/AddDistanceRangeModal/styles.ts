import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()(() => ({
  label: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    marginBottom: 10,
    color: "black",
  },
  buttonsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wrapper: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: 14,
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
