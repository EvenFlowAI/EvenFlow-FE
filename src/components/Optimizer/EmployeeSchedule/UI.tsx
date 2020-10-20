import {withStyles, Table} from "@material-ui/core";

export const ScheduleTable = withStyles({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: "bold",
            color: "#9FA2B4",
            borderBottom: "none"
        },
        "& .MuiTableRow-": {

        }
    }
})(Table);