import makeStyles from '@mui/styles/makeStyles';

export const useDialogStyles = makeStyles(theme => ({
    root: {
        "& hr": {
            margin: "28px 0",
        },
        "& input": {
            padding: 11,
            fontSize: 14
        },
    },
    dialogTitle: {
        textAlign: "left",
        "&> h2": {
            fontSize: 19,
            fontWeight: "bold"
        }
    },
    dialogContent: {
        padding: "10px 25px"
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    },
    dialogPaper: {
        backgroundColor: '#E5E5E5',
        maxWidth: 525,
        paddingBottom: 24,
        [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
            paddingBottom: 12,
        }
    }
}));