import { TableCell as TC } from "@mui/material";
import { withStyles } from 'tss-react/mui';
import {DemandTable} from "../../../../components/styled/DemandTable";

export const TableCell = withStyles(TC, {
    root: {
        padding: "24px 16px !important",
    }
});

export const HeaderTableCell = withStyles(TableCell, {
    root: {
        textTransform: "none",
    }
});

export const EligibleSegmentTable = withStyles(DemandTable, {
    root: {
        "& .MuiTableCell-root": {
            textTransform: "none",
        }
    }
});