import {TableRow as TR, withStyles} from "@material-ui/core";

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