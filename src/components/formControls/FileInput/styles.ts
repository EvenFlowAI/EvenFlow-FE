import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
  buttonWrapper: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "stretch",
  },
  uploadContained: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "white",
    backgroundColor: "#7898FF",
    padding: "9px 16px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  uploadOutlined: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#7898FF",
    border: "1px solid #7898FF",
    padding: "9px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
  fileInput: {
    display: "none",
  },
  fileLabel: {
    width: "100%",
  },
}));
