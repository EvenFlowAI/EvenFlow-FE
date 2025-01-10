import { withStyles } from "tss-react/mui";
import { TableCell as TC } from "@mui/material";

export const TableCell = withStyles(TC, {
  root: {
    border: "none !important",
    textAlign: "center",
  },
});

export const EditingCell = withStyles(TC, {
  root: {
    border: "none !important",
    padding: "23px 16px !important",
    textAlign: "center",
  },
});
