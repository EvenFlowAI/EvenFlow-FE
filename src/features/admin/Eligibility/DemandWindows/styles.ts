import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";

export const useStyles = makeStyles()(theme => ({
    switchCell: {
        fontSize: "14px !important",
        padding: "2px 12px !important"
    },
    tableWrapper: {
        overflowX: "auto",
        width: "100%",
        "& .MuiTableCell-root": {
            [theme.breakpoints.down('sm')]: {
                fontSize: "12px !important"
            }
        }
    },
    headerCell: {
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px !important"
        }
    }
}));

export const TableTitle = styled("div")({
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '20px 16px'
})