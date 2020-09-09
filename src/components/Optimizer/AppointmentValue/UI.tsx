import {Table, withStyles} from "@material-ui/core";

export const AppointmentTable = withStyles(theme => ({
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            padding: 17,
            fontWeight: "bold",
        },
        "& .MuiTableCell-body": {
            padding: "33px 17px",
        },
        "& .MuiTableCell-root": {
            fontSize: 16,
            backgroundColor: "#FFFFFF"
        },
        "& .primary": {
            color: theme.palette.primary.main
        }
    }
}))(Table);