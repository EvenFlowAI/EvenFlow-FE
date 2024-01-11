import { TableCell as TC } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
        textAlign: "center",
    }
})(TC);