import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles({
    row: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-end",
        marginBottom: 12,
        "&:last-child": {
            marginBottom: 0
        }
    },
    inputContainer: {
        flexBasis: 0,
        flexGrow: 1
    },
    divider: {
        textTransform: "uppercase",
        padding: 12,
        fontWeight: "bold",
        fontSize: 12
    }
})