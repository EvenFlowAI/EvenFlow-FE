import { makeStyles } from "tss-react/mui";

const borderRule = "1px solid #E0E2E8";

const defaultBorder = {
  borderLeft: borderRule,
  borderRight: borderRule,
};

//
export const useOptionsTableStyles = makeStyles()(() => ({
  container: {
    overflowX: "unset",
  },
  tableCell: {
    padding: 5.8,
    border: "none",
    width: 100,
  },
  tableBody: {
    padding: 2,
  },
  headerCell: {
    background: "black",
    color: "white",
    fontWeight: "bold",
    padding: 8,
    width: 100,
  },
  tableHeader: {
    marginBottom: 10,
  },
  firstRow: {
    borderTop: borderRule,
    ...defaultBorder,
  },
  lastRow: {
    borderBottom: borderRule,
    ...defaultBorder,
  },
  row: {
    ...defaultBorder,
  },
  checkbox: {
    color: "#DADADA",
    background: "white",
    "&.Mui-checked": {
      color: "#3855FE",
    },
  },
  optionName: {
    width: 100,
    background: "black",
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    overflow: "hidden",
    textOverflow: "ellipsis",
    minHeight: 14,

    "& > input": {
      padding: 3,
      fontSize: 12,
    },
  },
}));
