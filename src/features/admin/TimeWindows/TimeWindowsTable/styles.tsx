import { withStyles } from "tss-react/mui";
import { Button as Bt, TableCell as TC } from "@mui/material";

export const TableBodyCell = withStyles(TC, {
  root: {
    padding: "32px 16px !important",
  },
});

export const TableHeadCell = withStyles(TC, {
  root: {
    padding: "16px !important",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
export const Button = withStyles(Bt, {
  root: {
    fontSize: 16,
    textTransform: "none",
  },
});
