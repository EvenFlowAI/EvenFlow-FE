import {makeStyles, withStyles} from 'tss-react/mui';
import {TableCell as TC} from "@mui/material";

export const useStyles = makeStyles()(() => ({
    headCell: {
        fontSize: 12,
        fontWeight: 700,
        color: "#9FA2B4",
        textTransform: 'uppercase',
        borderTop: '1px solid #D9D9D9',
        borderBottom: '1px solid #D9D9D9',
        padding: '18px 36px',
    },
    cell: {
        fontSize: 16,
        padding: '22px 16px',
    },
    row: {
        borderRight: "1px solid #D9D9D9 !important"
    },
    rowTop: {
        borderRight: "1px solid #D9D9D9 !important",
        borderTop: "1px solid #D9D9D9 !important"
    },
}));

export const UnplannedTableCell = withStyles(TC, {
    root: {
        border: "none !important",
        padding: "20px 16px !important",
        textAlign: "center",
    }
});