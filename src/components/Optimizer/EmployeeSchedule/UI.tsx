import {withStyles, Table} from "@material-ui/core";

export const ScheduleTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: "bold",
            color: "#9FA2B4",
        },
        "& .MuiTableCell-root": {
            borderBottom: "none",
            borderRight: `1px solid #E0E2E8`
        },
        "& .MuiTableCell-root:last-child, & .MuiTableCell-head": {
            borderRight: "none"
        },
        "& .MuiTableRow-root .MuiTableCell-body": {
            backgroundColor: "#fff"
        },
        "& .MuiTableRow-root:nth-child(2n) .MuiTableCell-body": {
            backgroundColor: "#F2F3F7"
        }
    }
}))(Table);