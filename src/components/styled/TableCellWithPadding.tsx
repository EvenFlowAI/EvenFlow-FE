import { TableCell as TC } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const TableCellWithPadding = withStyles({
    root: {
        padding: "12px 16px !important",
    }
})(TC);