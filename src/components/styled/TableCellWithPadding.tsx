import {TableCell as TC, withStyles} from "@material-ui/core";

export const TableCellWithPadding = withStyles({
    root: {
        padding: "12px 16px !important",
    }
})(TC);