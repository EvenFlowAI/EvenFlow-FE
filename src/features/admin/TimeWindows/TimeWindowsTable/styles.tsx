import {withStyles} from "tss-react/mui";
import {Button as Bt, TableCell as TC} from "@mui/material";

export const TableCell = withStyles(TC, {
    root: {
        padding: "12px 16px !important",
        textAlign: "center",
    }
});
export const Button = withStyles(Bt, {
    root: {
        fontSize: 16,
        textTransform: "none"
    }
});