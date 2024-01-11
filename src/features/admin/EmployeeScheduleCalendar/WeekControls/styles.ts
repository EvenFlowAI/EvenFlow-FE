import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles({
    container: {
        display: "inline-flex",
        alignSelf: 'flex-end',
        "&>*": {
            marginLeft: 8,
        }
    },
    arrowButton: {
        minWidth: 10,
        padding: 5,
        background: "#ffffff"
    },
    dateButton: {
        background: "#ffffff",
        textTransform: "none",
        minWidth: 140
    }
});