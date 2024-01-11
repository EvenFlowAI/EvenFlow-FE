import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    switchCell: {
        fontSize: "12px !important",
        padding: "2px 12px !important"
    },
    tableWrapper: {
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
    },
    serviceTypeCell: {
        fontSize: "18px !important",
        fontWeight: "bold",
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
}));