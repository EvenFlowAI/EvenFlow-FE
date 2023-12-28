import {Table as MuiTable, withStyles} from "@material-ui/core";

export const StyledTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            padding: 17,
            fontWeight: "bold",
            [theme.breakpoints.down("xs")]: {
                fontSize: 14,
            }
        },
        "& .MuiTableCell-body": {
            padding: "33px 17px",
            [theme.breakpoints.down("xs")]: {
                padding: theme.spacing(1)
            }
        },
        "& .MuiTableCell-root": {
            fontSize: 16,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${theme.palette.divider}`,
            [theme.breakpoints.down("xs")]: {
                fontSize: 14,
            }
        },
        "& .primary": {
            color: theme.palette.primary.main
        }
    }
}))(MuiTable);