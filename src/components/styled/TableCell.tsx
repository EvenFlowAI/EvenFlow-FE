import {TableCell as TC, withStyles} from "@material-ui/core";

export const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
        textAlign: "center",
    }
})(TC);