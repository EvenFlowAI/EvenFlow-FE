import { TableRow as TR } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const TableRow = withStyles(theme => ({
    root: {
        "&:nth-child(2n) .MuiTableCell-root": {
            backgroundColor: "#F2F3F7"
        },
        "& .MuiButton-root": {
            textTransform: "none",
            fontSize: 14
        },
        "&.MuiTableRow-head": {
            borderBottom: `1px solid ${theme.palette.divider}`
        }
    }
}))(TR);