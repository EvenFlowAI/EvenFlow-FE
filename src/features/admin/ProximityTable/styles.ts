import {withStyles} from "tss-react/mui";
import {TableCell as TC} from "@mui/material";

export const TableBodyCell = withStyles(TC, {
    root: {
        padding: "22px 16px !important",
    }
});

export const SliderCell = withStyles(TC, {
    root: {
        padding: "12px 24px !important",
    }
});