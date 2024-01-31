import { TableCell as TC } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const TableCell = withStyles(TC, {
    root: {
        border: "none !important",
        padding: "12px 16px !important",
        textAlign: "center",
    }
});