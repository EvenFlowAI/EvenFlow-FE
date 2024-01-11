import { TableCell as TC } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import {DemandTable} from "../../../../components/styled/DemandTable";

export const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
    }
})(TC);

export const HeaderTableCell = withStyles({
    root: {
        color: '#9FA2B4',
        textTransform: "none",
    }
})(TableCell)

export const EligibleSegmentTable = withStyles({
    root: {
        "& .MuiTableCell-root": {
            textTransform: "none",
        }
    }
})(DemandTable)