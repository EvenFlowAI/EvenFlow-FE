import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    switchCell: {
        fontSize: "12px !important",
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