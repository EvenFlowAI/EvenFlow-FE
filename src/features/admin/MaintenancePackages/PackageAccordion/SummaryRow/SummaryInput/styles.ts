import { makeStyles } from "tss-react/mui";

const cellStyles = {
  width: 56,
  height: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "10px 26px",
  border: "1px solid #E0E2E8",
};

//
export const useStyles = makeStyles()(() => ({
  cell: {
    ...cellStyles,
    "& input": {
      color: "#9FA2B4",
    },
  },
  editableCell: {
    ...cellStyles,
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    top: "10%",
    right: "-42%",
  },
  input: {
    width: 56,
    textAlign: "center",
    background: "transparent",
    border: "none",
    outline: "none",
  },
  errorCell: {
    ...cellStyles,
    position: "relative",
    border: "1px solid red",
    color: "red",
  },
  value: {
    width: 56,
    textAlign: "center",
    color: "#9FA2B4",
  },
}));
