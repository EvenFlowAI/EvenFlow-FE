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
        background: "#ffffff",
        border: '1px solid #DADADA',
        color: "#000000"
    },
    dateButton: {
        minWidth: 140,
        textTransform: "none",
        padding: '5px 15px',
        border: '1px solid #DADADA',
        background: "#ffffff",
        color: "#000000"
    }
});