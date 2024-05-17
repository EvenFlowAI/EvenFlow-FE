import {withStyles} from "tss-react/esm/mui";
import {TableCell as TC} from "@mui/material";

export const StyledTableCell = withStyles(TC, {
    root: {
        border: "none !important",
        textAlign: "left",
        color: "#252733",
        backgroundColor: "#F2F4FB",
        verticalAlign: 'top',
        textTransform: 'capitalize',
        lineHeight: 'normal'
    }
});