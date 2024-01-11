import { Table as MuiTable } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const StyledTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            padding: 17,
            fontWeight: "bold",
            [theme.breakpoints.down('sm')]: {
                fontSize: 14,
            }
        },
        "& .MuiTableCell-body": {
            padding: "33px 17px",
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1)
            }
        },
        "& .MuiTableCell-root": {
            fontSize: 16,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            [theme.breakpoints.down('sm')]: {
                fontSize: 14,
            }
        },
        "& .primary": {
            color: theme.palette.primary.main
        }
    }
}))(MuiTable);