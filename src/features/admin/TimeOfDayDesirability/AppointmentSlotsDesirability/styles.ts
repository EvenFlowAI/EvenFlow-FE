import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    paper: {
        marginBottom: 20,
        borderRadius: 0,
        padding: '16px 0 16px 32px',
        position: "relative"
    },
    controlButtons: {
        position: "absolute",
        top: 0,
        right: 0,
        [theme.breakpoints.down('sm')]: {
            display: "flex",
            flexDirection: "column-reverse"
        }
    },
    progress: {
        padding: 10,
    },
    editButton: {
        textTransform: "none",
        fontSize: 14
    },
    gridContainer: {
        margin: "0 -16px"
    },
    row: {
        borderRight: `1px solid ${theme.palette.divider}`,
        [theme.breakpoints.down('sm')]: {
            borderRight: "none"
        }
    },
    checkRow: {
        display: "flex",
        justifyContent: "space-around",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column"
        }
    },
    title: {
        fontSize: 16,
        paddingRight: 32,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        margin: "0 0 16px",
    },
}));