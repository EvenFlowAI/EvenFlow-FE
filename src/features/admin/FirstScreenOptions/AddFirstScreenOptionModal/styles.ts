import { makeStyles } from "tss-react/mui";

//
export const useStyles = makeStyles()(() => ({
  inputsWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 18,
    marginBottom: 18,
  },
  uploadBtn: {
    width: "100%",
    textTransform: "none",
    padding: 10,
    border: "none",
    borderRadius: 4,
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#7898FF",
    cursor: "pointer",
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 12,
  },
  buttonWrapper: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "stretch",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  cancelButton: {
    color: "#9FA2B4",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "flex-end",
  },
  twoInputsWrapper: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginBottom: 18,
    marginTop: 18,
  },
}));
